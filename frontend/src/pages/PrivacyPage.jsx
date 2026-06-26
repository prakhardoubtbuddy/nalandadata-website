import { Link } from "react-router-dom";

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
      `When you visit or interact with the Platform, apart from Nalandadata certain third party advertisers and/or service providers may use technologies that automatically collect information about you for both transactional and promotional purposes. Your information may be collected by Nalandadata or such third party advertisers and/or service providers in the following ways:`,
      `Log Files: Every time you visit the Platform, Nalandadata servers automatically receive log information from your browser and device that was used to access the Platform (such as IP address, device ID, details of your network operator and type, your operating system, browser type and version, CPU speed, and connection speed).`,
      `Mobile Device: When you register your mobile device or use the mobile device to access the App, Nalandadata will also collect device information such as mobile device ID, model and manufacturer details, operating system etc. for the purpose of improving the App's overall functionality and displaying content according to your preferences.`,
      `Cookies: Cookies are data files placed on your device, used to keep track of information such as your interaction with social media websites, the content you click on, download, upload or share and other activity on the Platform etc.`,
      `Web Beacons: Web beacons are transparent graphic images used in our email communication to you, in order to understand customer behavior and improve the overall quality, functionality and interactivity of the Platform.`,
      `Mobile Analytics: Mobile analytics software is used by Nalandadata to better understand and customize the functionality of the App's software on your phone.`,
      `Payment / Purchase Information: In order to access certain paid features and services on the Platform, you may be required to create or log into a separate account on a payment gateway. Any and all payments made/processed or details provided to or shared with such authorized payment gateway providers shall be stored directly by such payment gateway providers without any information passing through or relayed to Nalandadata.`,
      `Public Forums: Any information that is disclosed by you in the comments section becomes published information and Nalandadata shall not be held liable for the security of the same or any personal information that you disclose herein.`,
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
        text: `We may disclose your information (but not Sensitive Personal Data or Information) to our service providers and business partners for the purposes of betterment and improvement of our services including but not limited to hosting the Platform, payment processing, analyzing data, providing customer service, etc. This will be in the form of aggregated anonymous data and will be under strict contractual arrangements that preserve the confidentiality and security of your personal information in accordance with this Privacy Policy.`,
      },
      {
        subtitle: "Limited Disclosures for Improvement of Services",
        text: `Nalandadata may share the aforesaid information including your personally identifiable information (but not Sensitive Personal Data or Information) when it is required to be shared with sponsors, partners, advertisers, analytics companies or third parties for the purpose of marketing, advertising promotional offers, offering product information and market research. This will be in the form of aggregated anonymized data and will be under strict contractual arrangements.`,
      },
    ],
  },
  {
    title: "Accessing and Updating Personal Information",
    content: [
      `When you use the Site or Services, we make good faith efforts to provide you, as and when requested by you, with access to your personal information and shall further ensure that any personal information or sensitive personal data or information found to be inaccurate or deficient shall be corrected or amended as feasible, subject to any requirement for such personal information or sensitive personal data or information to be retained by law or for legitimate business purposes.`,
      `Furthermore, you can request deletion of your personal info by sending an email to support@nalandadata.ai`,
    ],
  },
  {
    title: "Security of Information Collected",
    items: [
      `We take the security of your personal information seriously and use appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing and against accidental loss, destruction or damage.`,
      `We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure or destruction of data. All information gathered by the Company is securely stored within the Company controlled database. The database is stored on servers secured behind a firewall; access to the servers is password-protected and is strictly limited.`,
      `We keep your personal information for no longer than is necessary for our business purposes or for legal requirements.`,
    ],
  },
  {
    title: "Updates and Changes",
    content: [
      `We reserve the right to change (at any point of time) the terms of this Policy or the Terms of Use. Any changes we make will be effective immediately on notice, which we may give by posting the new policy on the Sites. Your use of the Sites or Services after such notice will be deemed acceptance of such changes.`,
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
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>

      {/* Hero */}
      <section className="s-band" style={{ borderTop: "none", paddingBottom: "40px" }}>
        <div className="s-wrap" style={{ maxWidth: "800px" }}>
          <nav className="s-crumb" aria-label="Breadcrumb" style={{ marginBottom: "18px" }}>
            <Link to="/">Home</Link> / Privacy Policy
          </nav>
          <p className="s-eyebrow">Legal</p>
          <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, margin: "12px 0 16px", color: "var(--paper)" }}>Privacy Policy</h1>
          <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6, maxWidth: "60ch" }}>
            Published in accordance with the provisions of the Information Technology Act, 2000 ("IT ACT"),
            Information Technology (Intermediary Guidelines) Rules, 2011, and Information Technology
            (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="s-band alt">
        <div className="s-wrap" style={{ maxWidth: "800px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {sections.map((section) => (
              <div key={section.title}>
                <h2 style={{
                  fontSize: "11px", fontFamily: "var(--mono)", letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "var(--accent)", margin: "0 0 16px",
                  paddingBottom: "12px", borderBottom: "1px solid var(--line)"
                }}>
                  {section.title}
                </h2>

                {section.content && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {section.content.map((para, j) => (
                      <p key={j} style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "14px", margin: 0 }}>{para}</p>
                    ))}
                  </div>
                )}

                {section.items && (
                  <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {section.items.map((item, j) => (
                      <li key={j} style={{ display: "flex", gap: "12px" }}>
                        <span style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "12px", flexShrink: 0, marginTop: "2px" }}>{j + 1}.</span>
                        <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "14px", margin: 0 }}>{item}</p>
                      </li>
                    ))}
                  </ol>
                )}

                {section.subsections && (
                  <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    {section.subsections.map((sub, j) => (
                      <div key={j} style={{ paddingLeft: "16px", borderLeft: "2px solid var(--line)" }}>
                        <h3 style={{ color: "var(--paper)", fontWeight: 600, fontSize: "14px", margin: "0 0 8px" }}>{sub.subtitle}</h3>
                        <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "14px", margin: 0 }}>{sub.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.contact && (
                  <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ background: "var(--ink)", border: "1px solid var(--line)", borderRadius: "10px", padding: "24px" }}>
                      <h3 style={{ color: "var(--paper)", fontWeight: 600, fontSize: "14px", margin: "0 0 14px" }}>{section.contact.title}</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13.5px" }}>
                        <p style={{ margin: 0, color: "var(--muted)" }}><span style={{ color: "var(--paper)" }}>Name:</span> {section.contact.name}</p>
                        <p style={{ margin: 0, color: "var(--muted)" }}><span style={{ color: "var(--paper)" }}>Email:</span>{" "}
                          <a href={`mailto:${section.contact.email}`} style={{ color: "var(--accent)" }}>{section.contact.email}</a>
                        </p>
                        <p style={{ margin: 0, color: "var(--muted)" }}><span style={{ color: "var(--paper)" }}>Support:</span>{" "}
                          <a href={`mailto:${section.contact.support}`} style={{ color: "var(--accent)" }}>{section.contact.support}</a>
                        </p>
                        <p style={{ margin: 0, color: "var(--muted)" }}><span style={{ color: "var(--paper)" }}>Address:</span> {section.contact.address}</p>
                      </div>
                    </div>

                    <div>
                      <p style={{ color: "var(--paper)", fontWeight: 500, fontSize: "13.5px", margin: "0 0 12px" }}>Please provide the following information in your complaint:</p>
                      <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {section.complaintItems.map((item, j) => (
                          <li key={j} style={{ display: "flex", gap: "10px" }}>
                            <span style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "12px", flexShrink: 0 }}>{String.fromCharCode(97 + j)})</span>
                            <p style={{ color: "var(--muted)", fontSize: "13.5px", lineHeight: 1.6, margin: 0 }}>{item}</p>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {section.footer.map((para, j) => (
                        <p key={j} style={{ color: "var(--muted)", fontSize: "13.5px", lineHeight: 1.6, margin: 0 }}>{para}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
