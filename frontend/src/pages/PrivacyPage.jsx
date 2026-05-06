import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const sections = [
  {
    title: "Introduction",
    content: [
      `This Privacy Policy ("Policy") explains our policy regarding the collection, use, disclosure and transfer of your information by S Chand And Company Limited and / or its subsidiary(ies) and / or affiliate(s) and / or business partners (collectively referred to as the "Company"), which powers and manages the website www.nalandadata.ai ("Site") and all platforms (web, apps, emails), or mobile / internet connected devices ("Services"). This Policy forms part and parcel of the Terms of Use. Capitalized terms which have been used here but are undefined shall have the same meaning as attributed to them in the Terms of Use.`,
      `This Privacy Policy is applicable to persons who view, browse or use the Services ("User"). For the purpose of this Policy, wherever the context so requires "you" or "your" shall mean User and the term "we", "us", "our" shall mean Company.`,
      `As we update, improve and expand the Services, this Policy may change, so please refer back to it periodically. By using the Site or the Services, you consent to collection, storage, and use of the personal information you provide (including any changes thereto as provided by you) for any of the services that we offer.`,
      `The Company respects the privacy of its Users and is committed to protect it in all respects.`,
    ],
  },
  {
    title: "Information Collected From You",
    items: [
      `When you use the Platform by way of registration, log in, creation of a user account, purchase of a test series, video course, attempting a mock test, etc. or by way of interaction via third party websites and/or mobile applications or by any other way of communication with the Platform, Nalandadata may collect your personal identifiable information including name, date of birth, gender, demographic information, photos, e-mail address, telephone number, mobile phone number, credit card or debit card details, geographic location, mailing address, social media account details including list of contacts/friends and examination preference.`,
      `Nalandadata will use this information to validate you as a user when using the Platform, to provide the Services to you, including administration of your user account, to notify you of changes to the Service or about any changes to our terms and conditions or privacy policy, to manage business, including financial reporting and billing of its Service, for the development of new products and services, to send you newsletters, offers and promotion coupons to market and advertise its products and services by email, to comply with applicable laws, court orders and government enforcement agency requests, for research and analytic purposes including to improve the quality of the Service and to ensure that the Service is presented in the most effective manner for you and your device.`,
      `By registering on the Nalandadata Platform, you agree and confirm your consent to providing Nalandadata your aforementioned personal information, which is lawful, necessary and permissible. You at all times have the right to discontinue the use of the Platform. Nalandadata is not liable to provide you its Services in the absence or your refusal to provide the aforesaid information. Additionally, Nalandadata is not liable to ensure or maintain the same quality of its Services to you, as it may for a user who provides all aforementioned information.`,
    ],
  },
  {
    title: "Information Collected Automatically",
    items: [
      `When you visit or interact with the Platform, apart from Nalandadata certain third party advertisers and/or service providers may use technologies that automatically collect information about you for both transactional (e.g., confirmation of registration, notification of purchase made, etc.) and promotional (e.g., promotions, emails, etc.) purposes. Your information may be collected by Nalandadata or such third party advertisers and/or service providers in the following ways:`,
      `Log Files: Every time you visit the Platform, Nalandadata servers automatically receive log information from your browser and device that was used to access the Platform (such as IP address, device ID, details of your network operator and type, your operating system, browser type and version, CPU speed, and connection speed). This enables us to validate you as a User, to understand your usage of the Platform and helps us to make changes and updates most suited to your needs and interests.`,
      `Mobile Device: When you register your mobile device or use the mobile device to access the App, in addition to the aforesaid, Nalandadata will also collect device information such as mobile device ID, model and manufacturer details, operating system etc. for the purpose of improving the App's overall functionality and displaying content according to your preferences.`,
      `Cookies: Cookies are data files placed on your device, used to keep track of information such as your interaction with social media websites, the content you click on, download, upload or share and other activity on the Platform etc. in order to improve your experience of the Platform by personalizing it to your preferences and usage trends.`,
      `Web Beacons: Web beacons are transparent graphic images used in our email communication to you, in order to understand customer behavior and improve the overall quality, functionality and interactivity of the Platform.`,
      `Mobile Analytics: Mobile analytics software is used by Nalandadata to better understand and customize the functionality of the App's software on your phone. This is done by collecting information such as your frequency of the App's usage, the features you prefer to use on the App, where the App was downloaded from, Device Id, name of other mobile applications on your device, etc.`,
      `Payment / Purchase Information: In order to access certain paid features and services on the Platform, you may be required to create or log into a separate account on a payment gateway or website such as "PayU" or "PayTM". Once such an account is created, in order to process your payments/purchases on the Platform, such payment gateway provider may require and collect your details such as name, address, phone number, email address and credit or debit card information, netbanking information or details of any web wallets maintained by you. Any and all payments made/processed or details provided to or shared with such authorized payment gateway providers shall be stored directly by such payment gateway providers without any information passing through or relayed to Nalandadata. Platform assumes no liability in respect of such payments and/or information shared with or provided to such authorized payment gateway providers. It is further clarified that the aforementioned information is only used in accordance with the provisions of the applicable law and in strict adherence to this Privacy Policy.`,
      `Public Forums: Any information that is disclosed by you in the comments section becomes published information and Nalandadata shall not be held liable for the security of the same or any personal information that you disclose herein. You agree to exercise caution when disclosing any personal information or personally identifiable information in this regard.`,
      `Please note that we only use the aforesaid information to communicate with and/or improve the Service and to better understand our users' operating systems, for system administration and to audit the use of the Service. We do not use any of the aforesaid data to identify the name, address or other personal details of any individual.`,
      `For the purpose of this Privacy Policy, any passwords, financial information such as credit or debit card details or other payment instrument details and any other information prescribed by law to be sensitive that may be collected by Nalandadata during your use of the Platform and the Services provided thereon, shall be referred to as "Sensitive Personal Data or Information".`,
    ],
  },
  {
    title: "Link to Third Parties",
    content: [
      `The Platform may include links that redirect you to other websites. These third party websites are not covered by this Privacy Policy. You agree that once you leave our servers, any third party websites that you go to or interact with are at your own risk. Nalandadata shall not be held liable for any default, loss of function or any risk that your personal sensitive information may be exposed to as a result of the same.`,
    ],
  },
  {
    title: "Sharing or Disclosure of Information Collected",
    content: [
      `As a strict policy we will not disclose, share or exploit your information with anyone without your permission.`,
      `However, we may be mandated under law or under contracts to make certain limited disclosures under the following circumstances:`,
    ],
    subsections: [
      {
        subtitle: "Legal Necessity",
        text: `Nalandadata may share any of the aforesaid information, including your personally identifiable information or Sensitive Personal Data or Information, without obtaining a separate consent from you, if and when such information is requested or required by law or by any court or governmental agency or authority to disclose, for the purpose of verification of identity, or for the prevention, detection, investigation of any criminal activity, or for prosecution and punishment of offence.`,
      },
      {
        subtitle: "Limited Disclosure to Service Providers",
        text: `We may disclose your information (but not Sensitive Personal Data or Information) to our service providers and business partners ("Service Providers") for the purposes of betterment and improvement of our services including but not limited to hosting the Platform, payment processing, analyzing data, providing customer service, etc., for the purpose of making various features, services and products of Nalandadata available to you and investigating or redressing grievances. This will be in the form of aggregated anonymous data and will be under strict contractual arrangements that preserve the confidentiality and security of your personal information in accordance with this Privacy Policy.`,
      },
      {
        subtitle: "Limited Disclosures for Improvement of Services",
        text: `Nalandadata may share the aforesaid information including your personally identifiable information (but not Sensitive Personal Data or Information) when it is required to be shared with sponsors, partners, advertisers, analytics companies or third parties for the purpose of marketing, advertising promotional offers, offering product information and market research, in connection with the Service. This will be in the form of aggregated anonymized data and will be under strict contractual arrangements that preserve the confidentiality and security of your personal information in accordance with this Privacy Policy.`,
      },
    ],
  },
  {
    title: "Accessing and Updating Personal Information",
    content: [
      `When you use the Site or Services, we make good faith efforts to provide you, as and when requested by you, with access to your personal information and shall further ensure that any personal information or sensitive personal data or information found to be inaccurate or deficient shall be corrected or amended as feasible, subject to any requirement for such personal information or sensitive personal data or information to be retained by law or for legitimate business purposes. We ask individual users to identify themselves and the information requested to be accessed, corrected or removed before processing such requests, and we may decline to process requests that are unreasonably repetitive or systematic, require disproportionate technical effort, jeopardize the privacy of others, or would be extremely impractical (for instance, requests concerning information residing on backup tapes), or for which access is not otherwise required. In any case where we provide information access and correction, we perform this service free of charge, except if doing so would require a disproportionate effort. Because of the way we maintain certain services and storage requirements under applicable law, after you delete your information, residual copies may take a period of time before they are deleted from our active servers and may remain in our backup systems.`,
      `Furthermore, you can request deletion of your personal info by sending an email to support@nalandadata.ai`,
    ],
  },
  {
    title: "Security of Information Collected",
    items: [
      `We take the security of your personal information seriously and use appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing and against accidental loss, destruction or damage. These include internal reviews of our data collection, storage and processing practices and security measures, including appropriate encryption and physical security measures to guard against unauthorized access to systems where we store personal data.`,
      `We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure or destruction of data. All information gathered by the Company is securely stored within the Company controlled database. The database is stored on servers secured behind a firewall; access to the servers is password-protected and is strictly limited. However, as effective as our security measures are, no security system is impenetrable. We cannot guarantee the security of our database, nor can we guarantee that information you supply will not be intercepted while being transmitted to us over the Internet. And, of course, any information you include in a posting to the discussion areas is available to anyone with Internet access.`,
      `We keep your personal information for no longer than is necessary for our business purposes or for legal requirements.`,
    ],
  },
  {
    title: "Updates and Changes",
    content: [
      `We reserve the right to change (at any point of time) the terms of this Policy or the Terms of Use. Any changes we make will be effective immediately on notice, which we may give by posting the new policy on the Sites. Your use of the Sites or Services after such notice will be deemed acceptance of such changes. We may also make reasonable efforts to inform you via electronic mail. In any case, you are advised to review this Policy periodically on the Site to ensure that you are aware of the latest version.`,
    ],
  },
  {
    title: "Grievance Redressal Mechanism",
    content: [
      `Any complaints or request or concerns with regards to use, processing or disclosure of information provided by you or breach of these terms may be taken up with the designated grievance redressal officer as mentioned below via post or by sending an email to jsingh.del@schandgroup.com`,
      `Any complaints, abuse or concerns with regards to content and or comment or breach of these terms shall be immediately informed to the designated Grievance Officer as mentioned below via in writing or through email signed with the electronic signature.`,
    ],
    contact: {
      title: "Grievance Redressal Officer",
      name: "Mr. Jagdeep Singh",
      email: "jsingh.del@schandgroup.com",
      support: "support@nalandadata.ai",
      address: "A-27, 2nd Floor, Mohan Cooperative Industrial Estate, New Delhi – 110044",
    },
    complaintItems: [
      "Identification of the information provided by you.",
      "Clear statement as to whether the information is personal information or sensitive personal information.",
      "Your address, telephone number or e-mail address.",
      "A statement that you have a good-faith belief that use of the information has been processed incorrectly or disclosed without authorization, as the case may be.",
      "A statement, under penalty of perjury, that the information in the notice is accurate, and that you are authorized to act on behalf of the owner of the right that is allegedly infringed.",
    ],
    footer: [
      `The Company may reach out to you to confirm or discuss certain details about your complaint and issues raised.`,
      `The Company shall not be responsible for any communication, if addressed, to any non-designated person in this regard.`,
      `You may also contact us in case you have any questions / suggestions about the Policy using the contact information mentioned above.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 text-white" data-testid="privacy-page">
      <Helmet>
        <title>Privacy Policy — Nalandadata.ai</title>
        <meta name="description" content="Nalandadata.ai privacy policy — how we collect, use, and protect your personal information." />
      </Helmet>
      {/* Header */}
      <section className="py-16 relative border-b border-white/5">
        <div className="absolute inset-0 hero-gradient opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-4">Legal</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              Published in accordance with the provisions of the Information Technology Act, 2000 ("IT ACT"),
              Information Technology (Intermediary Guidelines) Rules, 2011, Information Technology (Reasonable
              Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <h2 className="text-xl font-bold text-white mb-5 pb-3 border-b border-white/10 uppercase tracking-wide">
                {section.title}
              </h2>

              {/* Plain paragraphs */}
              {section.content && (
                <div className="space-y-4">
                  {section.content.map((para, j) => (
                    <p key={j} className="text-gray-400 leading-relaxed text-sm">
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Numbered items */}
              {section.items && (
                <ol className="space-y-4 list-none">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex gap-4">
                      <span className="text-blue-400 font-mono text-sm flex-shrink-0 mt-0.5">{j + 1}.</span>
                      <p className="text-gray-400 leading-relaxed text-sm">{item}</p>
                    </li>
                  ))}
                </ol>
              )}

              {/* Subsections */}
              {section.subsections && (
                <div className="mt-4 space-y-6">
                  {section.subsections.map((sub, j) => (
                    <div key={j} className="pl-4 border-l-2 border-blue-500/30">
                      <h3 className="text-white font-semibold mb-2">{sub.subtitle}</h3>
                      <p className="text-gray-400 leading-relaxed text-sm">{sub.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Grievance contact block */}
              {section.contact && (
                <div className="mt-6 space-y-6">
                  <div className="p-6 rounded-xl bg-[#121212] border border-white/5">
                    <h3 className="text-white font-semibold mb-4">{section.contact.title}</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-400"><span className="text-gray-300 font-medium">Name:</span> {section.contact.name}</p>
                      <p className="text-gray-400"><span className="text-gray-300 font-medium">Email:</span>{" "}
                        <a href={`mailto:${section.contact.email}`} className="text-blue-400 hover:underline">{section.contact.email}</a>
                      </p>
                      <p className="text-gray-400"><span className="text-gray-300 font-medium">For Support:</span>{" "}
                        <a href={`mailto:${section.contact.support}`} className="text-blue-400 hover:underline">{section.contact.support}</a>
                      </p>
                      <p className="text-gray-400"><span className="text-gray-300 font-medium">Address:</span> {section.contact.address}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-300 font-medium mb-3 text-sm">We request you to please provide the following information in your complaint:</p>
                    <ol className="space-y-2 list-none">
                      {section.complaintItems.map((item, j) => (
                        <li key={j} className="flex gap-3">
                          <span className="text-blue-400 font-mono text-sm flex-shrink-0">{String.fromCharCode(97 + j)})</span>
                          <p className="text-gray-400 text-sm leading-relaxed">{item}</p>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="space-y-3">
                    {section.footer.map((para, j) => (
                      <p key={j} className="text-gray-400 text-sm leading-relaxed">{para}</p>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
