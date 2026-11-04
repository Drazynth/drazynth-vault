
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export function WelcomeModal() {
  const [open, setOpen] = useState(() => {
  return sessionStorage.getItem('welcomeShown') !== 'true'
})

useEffect(() => {
  if (open) {
    sessionStorage.setItem('welcomeShown', 'true')
  }
}, [open])

  if (!open) return null

  return (
    <div className="welcome-overlay">
      <section
        className="welcome-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        <button
          className="welcome-close"
          onClick={() => setOpen(false)}
          aria-label="Close welcome message"
        >
          <X size={20} />
        </button>

        <div className="welcome-content">
          <p className="welcome-eyebrow">WELCOME TO</p>

          <h2 id="welcome-title">DRAZYNTH VAULT</h2>

          <h3>One Vault. Endless Editing Resources.</h3>

          <h4>ENGLISH</h4>

          <p>
            Welcome to DRAZYNTH VAULT — a platform created especially
            for video editors.
          </p>

          <p>
            We all know how difficult it can be to find useful editing
            resources. Sometimes, finding a single text effect, XML
            preset, sound effect, overlay, or other editing material
            means searching through countless websites, YouTube videos,
            and Telegram channels.
          </p>

          <p>
            That's exactly why I created DRAZYNTH VAULT: to bring useful
            editing resources together in one convenient place and make
            the search easier for everyone.
          </p>

          <p>
            Here, I'll try to upload something new regularly, including
            text effects, Alight Motion XML presets, SFX, overlays, APKs,
            and much more. Most resources will primarily be intended
            for Alight Motion users.
          </p>

          <h4>A NOTE ABOUT OWNERSHIP</h4>

          <p>
            I do not claim ownership or original authorship of resources
            created by other people. Some resources may be collected
            from publicly available YouTube channels, Telegram channels,
            or other sources. Wherever the original creator or source
            is identifiable, I'll try to provide proper credit,
            including the creator's name and YouTube channel.
          </p>

          <p>
            This platform is intended to help editors discover useful
            resources, learn, create, and improve their editing
            experience. All original creators deserve recognition
            for their hard work.
          </p>

          <p>
            Thank you for visiting DRAZYNTH VAULT and being a part
            of this growing editing community!
          </p>

          <div className="welcome-divider" />

          <h4>हिन्दी</h4>

          <p>
            DRAZYNTH VAULT में आपका स्वागत है — यह प्लेटफॉर्म खासतौर
            पर वीडियो एडिटर्स के लिए बनाया गया है।
          </p>

          <p>
            हम सभी जानते हैं कि एडिटिंग के लिए उपयोगी रिसोर्स ढूँढना
            कितना मुश्किल हो सकता है। कभी एक छोटा-सा Text Effect,
            XML Preset, Sound Effect या Overlay ढूँढने के लिए कई
            वेबसाइट्स, YouTube वीडियो और Telegram चैनल खंगालने पड़ते हैं।
          </p>

          <p>
            इसी परेशानी को खत्म करने के लिए मैंने DRAZYNTH VAULT बनाया
            है, ताकि एडिटिंग से जुड़े उपयोगी रिसोर्स एक ही जगह मिल सकें
            और सभी एडिटर्स का समय बच सके।
          </p>

          <p>
            यहाँ मैं नियमित रूप से नए रिसोर्स अपलोड करने की कोशिश
            करूँगा, जैसे Text Effects, Alight Motion XML Presets,
            SFX, Overlays, APKs और भी बहुत कुछ। यहाँ मिलने वाले
            अधिकतर रिसोर्स मुख्य रूप से Alight Motion यूजर्स के लिए होंगे।
          </p>

          <h4>ओनरशिप के बारे में</h4>

          <p>
            मैं किसी दूसरे व्यक्ति द्वारा बनाए गए रिसोर्स पर अपना
            मालिकाना हक या उसे खुद बनाने का दावा नहीं करता। कुछ
            रिसोर्स सार्वजनिक रूप से उपलब्ध YouTube चैनल, Telegram
            चैनल या अन्य स्रोतों से एकत्र करके शेयर किए जा सकते हैं।
            जहाँ भी असली क्रिएटर या सोर्स की जानकारी उपलब्ध होगी,
            वहाँ मैं उनका नाम और YouTube चैनल देने की कोशिश करूँगा।
          </p>

          <p>
            इस प्लेटफॉर्म का उद्देश्य एडिटर्स को उपयोगी रिसोर्स खोजने,
            सीखने, क्रिएट करने और अपनी एडिटिंग को बेहतर बनाने में
            मदद करना है। हर ओरिजिनल क्रिएटर को उसकी मेहनत का श्रेय
            मिलना चाहिए।
          </p>

          <p>
            DRAZYNTH VAULT पर आने और इस बढ़ती हुई एडिटिंग कम्युनिटी
            का हिस्सा बनने के लिए आपका बहुत-बहुत धन्यवाद!
          </p>

          <p className="welcome-thanks">
            THANK YOU FOR BEING HERE.
          </p>
        </div>
      </section>
    </div>
  )
}
