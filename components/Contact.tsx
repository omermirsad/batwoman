import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { logger } from '../utils/logger';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear status when user starts typing again
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    const emailJsConfig = {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    };

    // Check if EmailJS is configured
    const isEmailJsConfigured = emailJsConfig.serviceId && emailJsConfig.templateId && emailJsConfig.publicKey;

    try {
      if (isEmailJsConfigured) {
        // Send via EmailJS
        logger.userAction('Contact Form Submit', { email: formData.email });

        await emailjs.send(
          emailJsConfig.serviceId!,
          emailJsConfig.templateId!,
          {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_email: 'darkechology@gmail.com',
          },
          emailJsConfig.publicKey
        );

        logger.info('Contact form sent successfully via EmailJS');

        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message! I will get back to you soon.',
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        // Fallback: Log to console and show success message
        logger.warn('EmailJS not configured, using fallback');
        console.log('Contact form submission (EmailJS not configured):', formData);

        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message! Please email darkechology@gmail.com directly.',
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      }
    } catch (error) {
      logger.error('Contact form submission failed', error instanceof Error ? error : undefined);

      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or email darkechology@gmail.com directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Get in Touch</h2>
        <p className="mt-4 text-lg text-gray-400">
          For inquiries, collaborations, or media requests, please reach out via email.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 bg-[#1a1a2e] border border-indigo-600/30 rounded-lg px-4 py-2">
          <svg className="text-gray-400" fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M224,48H32a8,8,0,0,0-8,8V192a8,8,0,0,0,8,8H224a8,8,0,0,0,8-8V56A8,8,0,0,0,224,48Zm-8,135.54L152.12,128,216,72.46ZM32,184V64H40V184Zm8.46-111.54L104,128,40.46,72.46ZM109.88,132.46,128,148.1l18.12-15.64L208,184H48Z"></path></svg>
          <a className="font-medium text-gray-200 hover:text-indigo-500 transition-colors" href="mailto:darkechology@gmail.com">darkechology@gmail.com</a>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-12 space-y-6 bg-[#1a1a2e] p-8 rounded-xl border border-indigo-600/30">
        {submitStatus.type && (
          <div
            className={`p-4 rounded-lg border ${
              submitStatus.type === 'success'
                ? 'bg-green-900/20 border-green-500/30 text-green-400'
                : 'bg-red-900/20 border-red-500/30 text-red-400'
            }`}
          >
            <p className="text-sm font-medium">{submitStatus.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="name">Name</label>
            <input value={formData.name} onChange={handleChange} className="form-input block w-full bg-[#111121] border-gray-700 rounded-lg py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 placeholder:text-gray-500" id="name" name="name" placeholder="Your Name" type="text" required disabled={isSubmitting}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="email">Email</label>
            <input value={formData.email} onChange={handleChange} className="form-input block w-full bg-[#111121] border-gray-700 rounded-lg py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 placeholder:text-gray-500" id="email" name="email" placeholder="Your Email" type="email" required disabled={isSubmitting}/>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="subject">Subject</label>
          <input value={formData.subject} onChange={handleChange} className="form-input block w-full bg-[#111121] border-gray-700 rounded-lg py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 placeholder:text-gray-500" id="subject" name="subject" placeholder="Subject of your message" type="text" required disabled={isSubmitting}/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="message">Message</label>
          <textarea value={formData.message} onChange={handleChange} className="form-textarea block w-full bg-[#111121] border-gray-700 rounded-lg py-3 px-4 focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 placeholder:text-gray-500" id="message" name="message" placeholder="Your message..." rows={5} required disabled={isSubmitting}></textarea>
        </div>
        <div className="text-right">
          <button
            className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#1a1a2e] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;