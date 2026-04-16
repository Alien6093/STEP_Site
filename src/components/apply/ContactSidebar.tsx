"use client";
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactSidebar() {
  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      <Card className="border-border shadow-md bg-white dark:bg-zinc-950 overflow-hidden rounded-2xl p-0">
        <CardHeader className="bg-primary text-primary-foreground p-6 rounded-none">
          <CardTitle className="text-2xl font-bold">Reach Out Directly</CardTitle>
          <p className="text-primary-foreground/80 mt-2">
            Have questions before applying? Our team is here to help.
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Address */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">
                Headquarters
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                JSS Academy of Technical Education<br />
                C-20/1, Sector-62<br />
                NOIDA, UP 201301
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-border" />

          {/* Email */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Mail className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">
                Email
              </h4>
              <a
                href="mailto:ceo@jssstepnoida.org"
                className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center"
              >
                ceo@jssstepnoida.org
              </a>
            </div>
          </div>

          <div className="w-full h-px bg-border" />

          {/* Phone */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Phone className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">
                Phone
              </h4>
              <a
                href="tel:0120-2401442"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                0120-2401442
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Embed Container */}
      <Card className="border-border shadow-md bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-900 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.114827184246!2d77.3549214!3d28.6288869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce551e18bbb71%3A0xe5ed849f131102e1!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="JSS STEP Noida Location"
          />
        </div>
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-border flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">Get Directions</span>
          <a href="https://maps.google.com/?q=JSS+Academy+of+Technical+Education+Noida" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-primary">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </Card>
    </div>
  );
}
