import { UserProfile } from "@clerk/nextjs";
import { Crown, SlidersHorizontal } from "lucide-react";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 sm:p-6">
          <UserProfile
            routing="path"
            path="/account"
            appearance={{
              variables: {
                colorBackground: "#0a0a0a",
                colorPrimary: "#ffffff",
                colorText: "#ffffff",
                colorInputBackground: "#111111",
                colorInputText: "#ffffff",
                colorNeutral: "#171717",
              },
              elements: {
                rootBox: "w-full",
                card: "bg-[#0a0a0a] border border-white/10 shadow-none rounded-[1.5rem]",
                navbar: "bg-[#0a0a0a] border-r border-white/10",
                navbarButton:
                  "text-white/75 hover:bg-white/5 hover:text-white rounded-xl",
                navbarButtonActive:
                  "bg-white text-black hover:bg-white hover:text-black rounded-xl",
                pageScrollBox: "bg-[#0a0a0a]",
                profilePage: "bg-[#0a0a0a]",
                formButtonPrimary:
                  "bg-white text-black hover:bg-white/90 rounded-xl shadow-none",
                formFieldInput:
                  "bg-[#111111] text-white border border-white/10 focus:border-white rounded-xl",
                formFieldLabel: "text-white/80",
                headerTitle: "text-white",
                headerSubtitle: "text-white/60",
                badge: "bg-white/10 text-white border border-white/10",
                accordionTriggerButton:
                  "bg-[#111111] border border-white/10 text-white rounded-xl",
                accordionContent:
                  "bg-[#0f0f0f] border border-white/10 rounded-xl",
                menuButton: "bg-[#111111] border border-white/10 text-white",
                menuList: "bg-[#111111] border border-white/10",
                menuItem: "text-white hover:bg-white/5",
                footerActionLink: "text-white underline",
              },
            }}
          >
            <UserProfile.Link
              label="Abonnement"
              labelIcon={<Crown className="h-4 w-4" />}
              url="/billing"
            />
            <UserProfile.Link
              label="Préférences"
              labelIcon={<SlidersHorizontal className="h-4 w-4" />}
              url="/settings/preferences"
            />
          </UserProfile>
        </div>
      </div>
    </main>
  );
}