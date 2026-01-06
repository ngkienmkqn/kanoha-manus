export default function Policy() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20">
      <div className="container py-16 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-primary" />
          <span className="text-primary font-bold tracking-widest uppercase">Legal</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-12">
          Privacy Policy & Terms of Service
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h3>1. Introduction</h3>
          <p>
            Welcome to KANOHA LIMITED. We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our services.
          </p>

          <h3>2. Information We Collect</h3>
          <p>
            We collect information that you provide directly to us, such as when you create an account, request a quote, or communicate with us. This may include your name, email address, phone number, and company details.
          </p>

          <h3>3. How We Use Your Information</h3>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you about your account and our services.
          </p>

          <h3>4. Data Security</h3>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet is 100% secure.
          </p>

          <h3>5. Terms of Service</h3>
          <p>
            By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
          </p>

          <h3>6. Changes to This Policy</h3>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>

          <h3>7. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us at kanohalimited@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
}
