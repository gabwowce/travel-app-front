// app/(legal)/privacy.tsx
import React from "react";
import { ScrollView } from "react-native";
import { Stack } from "expo-router";
import { VStack, Heading, Text } from "native-base";

/**
 * Privacy Policy screen
 * ---------------------
 * • English version for GDPR transparency.
 * • Replace placeholder company/contact details with your real ones.
 * • Wrap paragraphs in your i18n <Trans> component if you already use translations.
 * • Screen is static ‑ you can fetch from CMS or markdown file instead.
 */
export default function PrivacyPolicy() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Stack.Screen
        options={{
          title: "Privacy Policy",
          headerBackTitle: "Back",
        }}
      />

      <VStack space={4}>
        <Heading size="lg">Privacy Policy</Heading>
        <Text>
          Updated: 2025‑05‑02{"\n"}
          {"\n"}
          This privacy policy explains how the Travel App ("we") collect, use,
          and protect your personal data when you use our services.
        </Text>

        <Heading size="md">1. What data do we collect?</Heading>
        <Text>
          • Account data: name, email address, password.{"\n"}
          • Location data: GPS coordinates and movement history during active tours.{"\n"}
          • App usage data: selected countries, cities, categories, and routes.
        </Text>

        <Heading size="md">2. How do we use the data?</Heading>
        <Text>
          • To create and authenticate your account.{"\n"}
          • To personalize tours and recommendations.{"\n"}
          • To notify you when you are near a point of interest.{"\n"}
          • For analytics and app improvement.
        </Text>

        <Heading size="md">3. Legal basis</Heading>
        <Text>
          We process your data under Article 6(1)(a), (b), and (f) of the GDPR –
          your consent, performance of a contract, and our legitimate interest
          to improve the service.
        </Text>

        <Heading size="md">4. Data retention</Heading>
        <Text>
          Your data is stored on servers within the European Union for as long
          as necessary for the purposes mentioned above or until you delete
          your account.
        </Text>

        <Heading size="md">5. Your rights</Heading>
        <Text>
          You have the right to access, correct, delete, restrict, or object to
          the processing of your data, and the right to data portability. To
          exercise these rights, contact us at the details below.
        </Text>

        <Heading size="md">6. Contact</Heading>
        <Text>
          UAB “Travel Solutions”{"\n"}
          Email: privacy@travel-app.test
        </Text>
      </VStack>
    </ScrollView>
  );
}
