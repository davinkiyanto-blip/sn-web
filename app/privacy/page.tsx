'use client'

import Header from '@/components/Layout/Header'
import BottomNav from '@/components/Layout/BottomNav'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-4">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p>
                Melodia ("Company," "we," "us," "our," or "Service") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services, including all related applications, products, and services that link to this Privacy Policy.
              </p>
              <p className="mt-4">
                Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Service. By using Melodia, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.1 Information You Provide Directly</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Account Information:</strong> When you create an account via Google Sign-In, we collect your email address, display name, and profile picture from your Google account.</li>
                <li><strong>Content You Create:</strong> When you generate music using our Service, we collect the prompts, descriptions, and preferences you provide, as well as the generated music files.</li>
                <li><strong>Communication Data:</strong> If you contact us via email or other support channels, we collect the content of your communications.</li>
                <li><strong>Payment Information:</strong> If you make purchases, we process payment information through third-party payment processors (e.g., Midtrans). We do not store full credit card details on our servers.</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Information Collected Automatically</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Device Information:</strong> Browser type, operating system, device identifiers, and device settings.</li>
                <li><strong>Usage Information:</strong> Pages visited, features used, duration of activity, and interactions with our Service.</li>
                <li><strong>Location Information:</strong> General geographic location based on IP address (not precise GPS location).</li>
                <li><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to track user activity and improve our Service.</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Information from Third Parties</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Google Authentication:</strong> When you log in via Google, we receive information from Google according to the permissions you grant.</li>
                <li><strong>Payment Processors:</strong> We receive transaction confirmation and limited payment information from our payment processor partners.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Providing, maintaining, and improving our Service</li>
                <li>Creating and managing your account</li>
                <li>Processing transactions and sending transaction confirmations</li>
                <li>Sending administrative information, updates, security alerts, and support messages</li>
                <li>Personalizing your experience and delivering content tailored to your interests</li>
                <li>Responding to your inquiries and providing customer support</li>
                <li>Monitoring and analyzing trends, usage, and activities for security and fraud prevention</li>
                <li>Detecting and preventing fraudulent transactions and other illegal activities</li>
                <li>Complying with legal obligations and enforcement of our agreements</li>
                <li>With your consent, sending promotional communications about new features or services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.1 Third-Party Service Providers</h3>
              <p>
                We may share your information with third-party service providers who perform services on our behalf, including cloud hosting providers (Firebase), payment processors (Midtrans), analytics providers, and customer support platforms. These service providers are contractually obligated to use your information only as necessary to provide services to us.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2 Suno API</h3>
              <p>
                To generate music, we transmit your prompts and preferences to the Suno API. Your data will be processed according to Suno's privacy policy and terms of service. We recommend reviewing Suno's privacy policy at their official website.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3 Legal Requirements</h3>
              <p>
                We may disclose your information when required by law, such as in response to subpoenas, court orders, or other legal processes, or when we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.4 Business Transfers</h3>
              <p>
                If we are involved in a merger, acquisition, bankruptcy, or other business transaction, your information may be part of those negotiations. We will provide notice before your personal information becomes subject to a different privacy policy.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.5 With Your Consent</h3>
              <p>
                We may share your information with third parties when you explicitly consent to such sharing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical, administrative, and physical security measures designed to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will remove your personal data within 30 days, except where we are required to retain it by law. Generated music files may be retained for backup and legal compliance purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Your Privacy Rights</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.1 Access and Portability</h3>
              <p>
                You have the right to request access to your personal information and receive a copy of the data we hold about you in a portable format.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.2 Correction and Deletion</h3>
              <p>
                You have the right to request correction of inaccurate personal information and, in certain circumstances, the deletion of your personal information, subject to legal obligations to retain data.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.3 Opt-Out</h3>
              <p>
                You may opt out of receiving promotional emails by clicking the unsubscribe link in our emails or by contacting us directly.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.4 GDPR and CCPA Rights</h3>
              <p>
                If you are a resident of the European Union or California, you may have additional rights under the General Data Protection Regulation (GDPR) or California Consumer Privacy Act (CCPA), respectively. Please contact us if you wish to exercise any of these rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to remember your preferences, understand how you use our Service, and improve your experience. You can control cookie settings through your browser. However, disabling cookies may limit your ability to access certain features of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Third-Party Links</h2>
              <p>
                Our Service may contain links to third-party websites and services that are not operated by us. This Privacy Policy does not apply to these external sites, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party sites before providing your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Children's Privacy</h2>
              <p>
                Melodia is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 without verifiable parental consent, we will delete such information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. International Data Transfers</h2>
              <p>
                Your information may be transferred to, stored in, and processed in countries other than your country of residence, which may have different data protection laws. By using Melodia, you consent to the transfer of your information to countries outside your country of residence.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by posting the updated Privacy Policy on our website and updating the "Last Updated" date. Your continued use of Melodia following the posting of revised Privacy Policy means you accept and agree to the changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-white/10 rounded-lg">
                <p><strong>Email:</strong> privacy@melodia.app</p>
                <p><strong>Website:</strong> melodia.app</p>
                <p><strong>Mailing Address:</strong> Melodia Inc., Privacy Department, [Your Address]</p>
              </div>
            </section>

            <section className="pt-8 border-t border-white/10">
              <p className="text-sm text-gray-400">
                <strong>Last Updated:</strong> January 16, 2026
              </p>
            </section>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
