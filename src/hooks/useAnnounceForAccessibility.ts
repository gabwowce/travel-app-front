import { useEffect, useCallback } from "react";
import { AccessibilityInfo, Platform } from "react-native";

/**
 * Options for `useAnnounceForAccessibility`.
 */
export interface AnnounceOptions {
  /**
   * Delay (ms) before the message is announced.  
   * Useful when the screen is transitioning and VO/TalkBack
   * needs a short pause to attach to the new view.
   *
   * @default 0
   */
  delay?: number;

  /**
   * Whether to request an "assertive" priority on Android TalkBack.
   * iOS ignores this setting.
   *
   * @default true
   */
  assertive?: boolean;

  /**
   * Completely disable announcing.  
   * Handy for server-side rendering or unit tests.
   *
   * @default true
   */
  enabled?: boolean;
}

/**
 * **`useAnnounceForAccessibility`**
 *
 * Reusable React hook that speaks `message` via VoiceOver / TalkBack
 * every time `message` changes (or when the component mounts, if non-empty).
 *
 * ```tsx
 * const { t } = useTranslation();
 * useAnnounceForAccessibility(t("loading"));
 * ```
 *
 * It automatically checks whether a screen reader is enabled to avoid
 * unnecessary work when accessibility services are off.
 *
 * ##### Behaviour
 * * Waits optional `delay` before announcing.
 * * Clears the timeout on unmount or when the message changes.
 * * Uses `AccessibilityInfo.announceForAccessibility` under the hood.
 */
export default function useAnnounceForAccessibility(
  message: string | null | undefined,
  {
    delay = 0,
    assertive = true,
    enabled = true,
  }: AnnounceOptions = {},
): void {
  const announce = useCallback(() => {
    if (!message || !enabled) return;

    const timer = setTimeout(() => {
      AccessibilityInfo.isScreenReaderEnabled().then((screenReaderEnabled) => {
        if (!screenReaderEnabled) return;

        // On Android we *could* tweak live-region priority; in practice,
        // double announce ensures the message is heard at once.
        if (Platform.OS === "android" && assertive) {
          AccessibilityInfo.announceForAccessibility(message);
        } else {
          AccessibilityInfo.announceForAccessibility(message);
        }
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [message, delay, assertive, enabled]);

  useEffect(() => {
    return announce();
  }, [announce]);
}