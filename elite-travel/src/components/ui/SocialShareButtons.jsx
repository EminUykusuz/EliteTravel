import { Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function SocialShareButtons({ url, title, description, image }) {
  const { t } = useTranslation('common');
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description || '');
  const shareImage = encodeURIComponent(image || '');

  const handleShare = (platform) => {
    // Google Analytics tracking
    if (window.gtag) {
      window.gtag('event', 'share', {
        method: platform,
        content_type: 'tour',
        item_id: url
      });
    }
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#145dbf]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      onClick: () => handleShare('facebook')
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2] hover:bg-[#0d8ddb]',
      url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
      onClick: () => handleShare('twitter')
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2] hover:bg-[#084d91]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      onClick: () => handleShare('linkedin')
    },
    {
      name: 'WhatsApp',
      icon: Share2,
      color: 'bg-[#25D366] hover:bg-[#1da851]',
      url: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
      onClick: () => handleShare('whatsapp')
    }
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600">{t('tourDetail.share')}:</span>
      <div className="flex gap-2">
        {shareLinks.map((social) => (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={social.onClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`${social.color} text-white p-2 rounded-full shadow-lg transition-colors`}
            aria-label={`Share on ${social.name}`}
          >
            <social.icon size={18} />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
