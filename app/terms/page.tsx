'use client'

import Header from '@/components/Layout/Header'
import BottomNav from '@/components/Layout/BottomNav'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Melodia ("Service," "Platform," "Website," or "Application"), you accept and agree to be bound by the terms and provision of this Terms of Service Agreement ("Agreement"). If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="mt-4">
                Melodia reserves the right to make changes to this Agreement at any time without notice. Your continued use of Melodia indicates your acceptance of the updated terms. Please review this Agreement periodically to stay informed of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. License and Restrictions</h2>
              <p>
                Melodia grants you a limited, non-exclusive, non-transferable license to access and use the Service for your personal, non-commercial use only. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service</li>
                <li>Modify, adapt, translate, reverse engineer, decompile, disassemble, or hack the Service</li>
                <li>Use automated tools, bots, or scripts to access the Service</li>
                <li>Access or use the Service for any illegal purpose or in violation of applicable laws</li>
                <li>Attempt to gain unauthorized access to any portion or feature of the Service</li>
                <li>Interfere with or disrupt the integrity or performance of the Service</li>
                <li>Remove, obscure, or alter any proprietary notices, labels, or marks</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.1 Account Registration</h3>
              <p>
                To access certain features of Melodia, you must create an account using Google Sign-In authentication. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access to your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Account Eligibility</h3>
              <p>
                You must be at least 13 years old to create an account on Melodia. By creating an account, you represent and warrant that you are at least 13 years old and have the legal right to enter into this Agreement. Users between 13 and 18 years old must have parental consent.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.3 Account Termination</h3>
              <p>
                Melodia reserves the right to terminate or suspend your account at any time, without cause or notice, if we determine that you have violated this Agreement or engaged in conduct harmful to our Service, other users, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Content and Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.1 User-Generated Content</h3>
              <p>
                When you use Melodia to generate music, any prompts, descriptions, and other input you provide ("User Input") remain your property. However, you grant Melodia a worldwide, royalty-free license to use, reproduce, modify, and distribute your User Input solely to provide and improve the Service.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2 Generated Music Ownership</h3>
              <p>
                Music generated using Melodia and the Suno API ("Generated Music") may be subject to Suno's intellectual property terms. By generating music through our Service, you acknowledge that:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Generated Music is created using Suno's technology</li>
                <li>You must comply with Suno's terms of service regarding the Generated Music</li>
                <li>You understand and accept Suno's intellectual property rights over the Generated Music</li>
                <li>The licensing terms for the Generated Music are determined by Suno, not Melodia</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3 Melodia Intellectual Property</h3>
              <p>
                All content, features, and functionality of Melodia, including the user interface, design, text, graphics, logos, and software, are the exclusive property of Melodia and are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Create or generate music that is hateful, discriminatory, or promotes violence</li>
                <li>Generate music that infringes on third-party intellectual property rights</li>
                <li>Generate music that is sexually explicit, obscene, or contains graphic violence</li>
                <li>Use the Service to defame, harass, threaten, or abuse any person or entity</li>
                <li>Attempt to circumvent payment systems or use fraudulent payment methods</li>
                <li>Engage in any form of harassment, bullying, or abusive behavior toward other users</li>
                <li>Spam, post redundant, or excessively promotional content</li>
                <li>Impersonate or mislead others about your identity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
              <p>
                TO THE FULLEST EXTENT PERMITTED BY LAW, MELODIA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, EVEN IF MELODIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="mt-4">
                The maximum liability of Melodia for any claim arising out of or related to this Agreement shall not exceed the amount you have paid to Melodia in the past 12 months, or $100, whichever is greater.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Disclaimer of Warranties</h2>
              <p>
                MELODIA IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="mt-4">
                Melodia does not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. Melodia does not warrant the accuracy, completeness, or quality of any information provided through the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Payment and Billing</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.1 Subscription and Charges</h3>
              <p>
                Some features of Melodia may require payment. By making a purchase, you authorize Melodia to charge your payment method for the amount due. All fees and charges are exclusive of applicable taxes, which will be added to your bill.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.2 Refund Policy</h3>
              <p>
                Most purchases are non-refundable. However, we may offer refunds at our sole discretion if you request a refund within 7 days of purchase. Credits used or services rendered cannot be refunded.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.3 Billing Information</h3>
              <p>
                You agree to keep your billing information accurate and up-to-date. We are not responsible for failed charges due to inaccurate billing information provided by you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Third-Party Services</h2>
              <p>
                Melodia integrates with third-party services, including but not limited to Suno API, Firebase, and payment processors. Your use of these services is subject to their respective terms of service and privacy policies. Melodia is not responsible for the availability, functionality, or content of third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Melodia and its officers, directors, employees, agents, and successors from any and all claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising out of or relating to:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Your use of the Service</li>
                <li>Your violation of this Agreement</li>
                <li>Your infringement of any intellectual property or other rights</li>
                <li>Content you generate using the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Governing Law and Jurisdiction</h2>
              <p>
                This Agreement shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflicts of law provisions. You agree to submit to the exclusive jurisdiction of the courts located in [Your Jurisdiction] for the resolution of any disputes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Severability</h2>
              <p>
                If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. The invalid or unenforceable provision shall be modified to the minimum extent necessary to make it valid and enforceable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Entire Agreement</h2>
              <p>
                This Agreement, along with any other policies and guidelines posted on Melodia, constitutes the entire agreement between you and Melodia regarding the use of the Service and supersedes all prior or contemporaneous communications, whether written or oral.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Dispute Resolution</h2>
              <p>
                Before filing a claim, you agree to attempt to resolve any dispute by contacting Melodia support. If the dispute cannot be resolved within 30 days, either party may initiate formal proceedings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">15. Contact Information</h2>
              <p>
                For questions or concerns regarding this Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-white/10 rounded-lg">
                <p><strong>Email:</strong> support@melodia.app</p>
                <p><strong>Website:</strong> melodia.app</p>
                <p><strong>Mailing Address:</strong> Melodia Inc., Legal Department, [Your Address]</p>
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
