/**
 * Secrets Management and Environment Validation
 *
 * This module provides centralized validation for all required secrets and environment variables.
 * It ensures that secrets are properly configured for different environments (local, preview, production).
 *
 * Environment Requirements:
 * - Local/Grader: Local Supabase CLI, demo deposit flow
 * - Preview: Hosted Supabase preview project, Stripe test mode
 * - Production: Hosted Supabase production project, Stripe live mode
 */

export type Environment = "local" | "preview" | "production";

export interface SecretValidationResult {
  valid: boolean;
  environment: Environment;
  errors: string[];
  warnings: string[];
}

/**
 * Detects the current environment based on environment variables
 */
export function detectEnvironment(): Environment {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";

  if (isLocalSupabaseUrl(supabaseUrl)) {
    return "local";
  }

  if (isHostedSupabaseUrl(supabaseUrl)) {
    // Check if it's a preview or production URL
    if (supabaseUrl.includes(".preview.")) {
      return "preview";
    }
    return "production";
  }

  // Default to local if we can't determine
  return "local";
}

function isLocalSupabaseUrl(url: string): boolean {
  return /:\/\/(127\.0\.0\.1|localhost)([:/]|$)/.test(url) || url.includes(":54321");
}

function isHostedSupabaseUrl(url: string): boolean {
  return url.includes(".supabase.co");
}

/**
 * Validates all required secrets for the current environment
 */
export function validateSecrets(): SecretValidationResult {
  const environment = detectEnvironment();
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!supabaseUrl) {
    errors.push("Missing NEXT_PUBLIC_SUPABASE_URL");
  } else if (environment === "local" && !isLocalSupabaseUrl(supabaseUrl)) {
    errors.push(
      "NEXT_PUBLIC_SUPABASE_URL should point to local Supabase (http://127.0.0.1:54321) in local environment",
    );
  } else if (environment !== "local" && isLocalSupabaseUrl(supabaseUrl)) {
    errors.push(
      "NEXT_PUBLIC_SUPABASE_URL should point to hosted Supabase in preview/production environment",
    );
  }

  if (!supabasePublishableKey) {
    errors.push("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  if (!supabaseSecretKey) {
    errors.push("Missing SUPABASE_SECRET_KEY");
  } else if (environment === "local" && supabaseSecretKey.startsWith("eyJ")) {
    warnings.push(
      "SUPABASE_SECRET_KEY looks like a hosted JWT key. Use the secret from `npx supabase status -o env` for local development.",
    );
  } else if (environment !== "local" && supabaseSecretKey.startsWith("sb_secret_")) {
    warnings.push(
      "SUPABASE_SECRET_KEY looks like a local CLI secret. Use the hosted service role key for preview/production.",
    );
  }

  // Validate Clerk configuration
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  const clerkSecretKey = process.env.CLERK_SECRET_KEY?.trim();

  if (!clerkPublishableKey) {
    errors.push("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }

  if (!clerkSecretKey) {
    errors.push("Missing CLERK_SECRET_KEY");
  }

  // Validate Stripe configuration (required for non-local environments)
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (environment !== "local") {
    if (!stripeSecretKey) {
      errors.push("Missing STRIPE_SECRET_KEY (required for preview/production)");
    } else if (environment === "production" && stripeSecretKey.startsWith("sk_test_")) {
      warnings.push(
        "STRIPE_SECRET_KEY is a test key. Use a live key (sk_live_) for production.",
      );
    } else if (environment === "preview" && stripeSecretKey.startsWith("sk_live_")) {
      warnings.push(
        "STRIPE_SECRET_KEY is a live key. Use a test key (sk_test_) for preview.",
      );
    }

    if (!stripeWebhookSecret) {
      errors.push("Missing STRIPE_WEBHOOK_SECRET (required for preview/production)");
    }
  }

  // Validate app URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!appUrl) {
    warnings.push(
      "Missing NEXT_PUBLIC_APP_URL. Defaulting to http://localhost:3000 for local development.",
    );
  }

  return {
    valid: errors.length === 0,
    environment,
    errors,
    warnings,
  };
}

/**
 * Checks if server-backed features are available
 */
export function isServerBacked(): boolean {
  return Boolean(
    process.env.SUPABASE_SECRET_KEY &&
      process.env.CLERK_SECRET_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

/**
 * Checks if Stripe payments are configured
 */
export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_WEBHOOK_SECRET &&
      process.env.CLERK_SECRET_KEY &&
      process.env.SUPABASE_SECRET_KEY,
  );
}

/**
 * Checks if demo deposit flow should be used (local/grader only)
 */
export function shouldUseDemoDeposit(): boolean {
  const environment = detectEnvironment();
  return environment === "local";
}

/**
 * Gets a formatted error message for display
 */
export function formatSecretErrors(result: SecretValidationResult): string {
  if (result.valid) {
    return "";
  }

  const lines = [
    `Environment: ${result.environment}`,
    "Missing or invalid secrets:",
    ...result.errors.map((e) => `  - ${e}`),
  ];

  if (result.warnings.length > 0) {
    lines.push("", "Warnings:", ...result.warnings.map((w) => `  - ${w}`));
  }

  return lines.join("\n");
}

/**
 * Throws an error if secrets are not valid
 */
export function requireValidSecrets(): void {
  const result = validateSecrets();
  if (!result.valid) {
    throw new Error(formatSecretErrors(result));
  }
}

/**
 * Logs warnings if any exist (for development)
 */
export function logSecretWarnings(): void {
  const result = validateSecrets();
  if (result.warnings.length > 0) {
    console.warn("[Secrets]", formatSecretErrors(result));
  }
}
