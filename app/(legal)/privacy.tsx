import React from "react";
import { ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Box, VStack, Heading, Text, Divider } from "native-base";
import FlexContainer from "@/src/components/layout/FlexContainer";
import Header from "@/src/components/Header";
import useAnnounceForAccessibility from "@/src/hooks/useAnnounceForAccessibility";

/**
 * Privacy Policy Screen – GDPR‑compliant, mobile‑first, and responsive.
 * Replace this static screen with a markdown/CMS fetch if preferred.
 */
const PRIVACY_UPDATED_AT = "2025‑05‑14";

export default function PrivacyPolicy() {
  useAnnounceForAccessibility("Privacy Policy screen opened");
  const router = useRouter();
  return (
    <FlexContainer gap={16}>
      {/* <Header title="Privacy Policy" onBackPress={() => router.back()} /> */}
      <ScrollView accessible={false} importantForAccessibility="no">
        <Stack.Screen
          options={{
            title: "Privacy Policy",
            headerBackTitle: "Back",
          }}
        />

        <Box safeAreaBottom px={{ base: 4, md: 6 }} py={6} maxW="3xl" mx="auto">
          <VStack space={6}>
            <Text fontSize="sm" color="gray.500">
              Last updated: {PRIVACY_UPDATED_AT}
            </Text>

            <Text>
              This Privacy Policy explains how “Travel Solutions”, UAB ("
              <Text bold>Travel App</Text>", "we", "our", "us") collects, uses,
              shares, and safeguards personal data when you access or use the
              Travel App mobile and web applications (the “Service”). It also
              describes the choices available to you regarding our use of your
              personal data and how you can exercise your GDPR rights.
            </Text>

            <Divider />

            <Heading accessibilityRole="header" size="md">1. Data We Collect</Heading>
            <Text>
              <Text bold>Account data —</Text> name, e‑mail address and hashed
              password you provide during registration.{"\n"}
              <Text bold>Location data —</Text> GPS coordinates and movement
              history while an active tour is running.{"\n"}
              <Text bold>Usage data —</Text> selected language, country, city,
              categories, route progress, and in‑app interactions.{"\n"}
              <Text bold>Device data —</Text> device model, operating system,
              app version, IP address and crash logs.{"\n"}
              <Text bold>Cookies & analytics —</Text> HTTP cookies and similar
              technologies used to analyse traffic and improve the Service.
            </Text>

            <Heading accessibilityRole="header" size="md">2. How We Use Your Data</Heading>
            <Text>
              • Create, authenticate and manage your account.{"\n"}• Personalise
              recommended routes and points of interest.{"\n"}• Notify you when
              you approach a point of interest (push / in‑app modal).{"\n"}•
              Store favourites, ratings and language preferences across devices.
              {"\n"}• Monitor performance, detect fraud and secure the Service.
              {"\n"}• Conduct aggregated analytics to improve features and
              content.
            </Text>

            <Heading accessibilityRole="header" size="md">3. Legal Bases</Heading>
            <Text>
              We process personal data under the GDPR on the following bases:
              {"\n"}• <Text italic>Consent</Text> (Art. 6‑1‑a) — e.g. sharing
              your real‑time location.{"\n"}• <Text italic>Contract</Text>
               (Art. 6‑1‑b) — providing the Service you request.{"\n"}•{" "}
              <Text italic>Legitimate interest</Text> (Art. 6‑1‑f) — protecting
              our users and improving the Service.
            </Text>

            <Heading accessibilityRole="header" size="md">4. Sharing & Transfers</Heading>
            <Text>
              We do <Text bold>not</Text> sell or rent your data. We share it
              only with:{"\n"}• Cloud hosting and analytics providers bound by
              data‑processing agreements.{"\n"}• Payment processors when you
              purchase paid routes.{"\n"}• Public authorities when legally
              required.{"\n"}
              All servers are located in the European Union. International
              transfers outside the EEA (if any) rely on adequacy decisions or
              Standard Contractual Clauses.
            </Text>

            <Heading accessibilityRole="header" size="md">5. Data Retention</Heading>
            <Text>
              Personal data is retained only as long as necessary for the
              purposes above, or until you delete your account. Location history
              older than 12 months is automatically anonymised.
            </Text>

            <Heading accessibilityRole="header" size="md">6. Your Rights</Heading>
            <Text>
              Under the GDPR you can request access, rectification, erasure,
              restriction, data portability, or object to processing. You can
              withdraw consent at any time in the app settings. To exercise your
              rights contact us via the details below. You also have the right
              to lodge a complaint with the Lithuanian Data Protection
              Inspectorate.
            </Text>

            <Heading accessibilityRole="header" size="md">7. Children</Heading>
            <Text>
              The Service is not directed to children under 13. We do not
              knowingly collect data from children. If you believe a child has
              provided personal data, please contact us so we can delete it.
            </Text>

            <Heading accessibilityRole="header" size="md">8. Security</Heading>
            <Text>
              We implement organisational and technical measures such as HTTPS
              encryption, pseudonymisation of location streams, and role‑based
              access controls to protect your data.
            </Text>

            <Heading accessibilityRole="header" size="md">9. Contact Us</Heading>
            <Text>
              UAB “Travel Solutions”{"\n"}
              J. Basana vičiaus g. 15‑1, LT‑03108 Vilnius, Lithuania{"\n"}
              E‑mail: <Text accessibilityRole="link" accessibilityLabel="Email: privacy at travel dash app dot test" underline>privacy@travel‑app.test</Text>
            </Text>

            <Divider />

            <Text fontSize="xs" color="gray.400">
              Version {PRIVACY_UPDATED_AT.replace(/‑/g, ".")}
            </Text>
          </VStack>
        </Box>
      </ScrollView>
    </FlexContainer>
  );
}
