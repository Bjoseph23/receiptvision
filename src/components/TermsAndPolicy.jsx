import React from 'react';

const TermsAndPolicy = () => {
    return (
        <main className="flex-1 p-8 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-blue-600 ">
              <span className="text-blue-600">Terms    </span>
              <span className="text-black">and   </span>
              <span className="text-blue-600">Privacy Policy  </span>
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Terms and Conditions Card */}
                <div className="bg-gray-200 rounded-lg p-6 shadow-md overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-lg">
                    <h3 className="text-2xl font-semibold mb-4">Terms and Conditions</h3>
                    <ul className="list-decimal list-inside space-y-4 text-gray-700">
                        <li><strong>GENERAL</strong>: ReceiptVision is an AI Financial Document Processing System aimed at streamlining financial document management.</li>
                        <li><strong>ACCEPTANCE OF TERMS</strong>: By using our Service, you agree to abide by these Terms of Service and our Privacy Policy.</li>
                        <li><strong>ELIGIBILITY</strong>: The Service is available to users aged 13 or older. If the user is below 18 years of age, the parent(s)/ guardian is expected to oversee the account.</li>
                        <li><strong>OWNERSHIP AND LICENSE</strong>: All content on ReceiptVision is owned by us or our licensors.</li>
                        <li><strong>USER ACCOUNTS</strong>: Users must provide accurate information and maintain confidentiality of account details.</li>
                        <li><strong>CONTENT YOU PROVIDE</strong>: You are responsible for any content uploaded to the Service.</li>
                        <li><strong>LIABILITY DISCLAIMER</strong>: The Service is provided "as is" without warranties.</li>
                        <li><strong>GOVERNING LAW</strong>: These terms are governed by the laws of Kenya.</li>
                        <li><strong>TERMINATION</strong>: We may terminate access to the Service without notice for violations of these terms.</li>
                        <li><strong>INDEMNIFICATION</strong>: Users agree to indemnify ReceiptVision against any legal claims arising from use of the Service.</li>
                        <li><strong>MODIFICATIONS</strong>: ReceiptVision reserves the right to modify these terms at any time.</li>
                        <li><strong>FEES</strong>: Some services may require payment of fees, as specified on our site.</li>
                        <li><strong>DATA STORAGE</strong>: We may retain your data for legal or business purposes.</li>
                        <li><strong>THIRD-PARTY LINKS</strong>: Our Service may contain links to third-party websites that we do not control.</li>
                        <li><strong>NO WAIVER</strong>: Our failure to enforce any provision of these terms does not constitute a waiver of our rights.</li>
                        <li><strong>INTELLECTUAL PROPERTY</strong>: Unauthorized use of our intellectual property, including trademarks, logos, and copyrighted content, is strictly prohibited.</li>
                        <li><strong>LIMITATION OF LIABILITY</strong>: To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</li>
                        <li><strong>ENTIRE AGREEMENT</strong>: These Terms constitute the entire agreement between you and ReceiptVision, superseding any prior agreements or communications.</li>
                        <li><strong>SEVERABILITY</strong>: If any provision of these Terms is found to be unenforceable, the remaining terms shall remain in effect.</li>
                        <li><strong>FORCE MAJEURE</strong>: We are not liable for any failure to perform our obligations due to events beyond our reasonable control, including natural disasters, war, or government actions.</li>

                    </ul>
                </div>

                {/* Privacy Policy Card */}
                <div className="bg-gray-200 rounded-lg p-6 shadow-md overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-lg">
                    <h3 className="text-2xl font-semibold mb-4">Privacy Policy</h3>
                    <ul className="list-decimal list-inside space-y-4 text-gray-700">
                        <li><strong>DATA COLLECTION</strong>: We collect personal information when you register and use our Service.</li>
                        <li><strong>USAGE DATA</strong>: Information on how the Service is accessed and used may be collected.</li>
                        <li><strong>DATA USE</strong>: Your data is used to provide and improve the Service, and to notify you about changes.</li>
                        <li><strong>DATA SECURITY</strong>: We take reasonable measures to protect your personal information.</li>
                        <li><strong>SHARING YOUR DATA</strong>: We do not sell or rent your personal information to third parties.</li>
                        <li><strong>USER RIGHTS</strong>: You have the right to access, update, or delete your personal data.</li>
                        <li><strong>COOKIES</strong>: We use cookies to enhance user experience and track site usage.</li>
                        <li><strong>DATA RETENTION</strong>: We retain data only as long as necessary for legal and operational purposes.</li>
                        <li><strong>THIRD-PARTY SERVICES</strong>: We may share data with trusted third parties to help provide our Service.</li>
                        <li><strong>ANALYTICS</strong>: We use analytics tools to understand usage patterns and improve our Service.</li>
                        <li><strong>CHANGES TO THIS POLICY</strong>: We may update our Privacy Policy from time to time.</li>
                        <li><strong>CONTACT US</strong>: For any questions about the Privacy Policy, please contact us through our support page.</li>
                        <li><strong>DATA TRANSFERS</strong>: Your information may be transferred to and processed in other countries.</li>
                        <li><strong>MINORS</strong>: Our Service is not intended for children under the age of 13. Children under the age of 18 should request their parent(s) or guardian(s) to oversee the use of their account.</li>
                        <li><strong>USER CONSENT</strong>: By using the Service, you consent to our data practices described in this policy.</li>
                        <li><strong>DATA ACCURACY</strong>: We strive to ensure that the data we collect and store is accurate, complete, and up-to-date, and we encourage users to update their information as needed.</li>
                        <li><strong>DATA PORTABILITY</strong>: Where applicable, you have the right to request a copy of your data in a structured, commonly used format.</li>
                        <li><strong>THIRD-PARTY PROCESSORS</strong>: We may engage trusted third-party processors to assist with data processing activities, in compliance with this policy.</li>
                        <li><strong>DATA BREACH NOTIFICATION</strong>: In the unlikely event of a data breach, we will promptly notify affected users and take appropriate actions to mitigate risks.</li>
                        <li><strong>OPT-OUT OPTIONS</strong>: You may opt out of certain data collection practices, such as marketing communications, at any time through your account settings.</li>
                    </ul>
                </div>
            </div>
        </main>
    );
};

export default TermsAndPolicy;
