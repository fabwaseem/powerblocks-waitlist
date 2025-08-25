"use client";

import {
  DiscordIcon,
  GoogleIcon,
  TelegramIcon,
  XIcon,
} from "@/components/common/icons";
import { VerificationModal } from "@/components/home/verification-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/auth-api";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Get referral code from URL params
  useEffect(() => {
    const refCode = searchParams.get("ref") || searchParams.get("referral");
    if (refCode) {
      setReferralCode(refCode);
    }
  }, [searchParams]);

  const sendCodeMutation = useMutation({
    mutationFn: authApi.sendCode,
    onSuccess: (data, variables) => {
      toast.success(data.message);
      setIsOTPModalOpen(true);
    },
    onError: () => {
      // recaptchaRef.current?.reset()
    },
  });

  const onSignupSubmit = async (data: { email: string }) => {
    // const recaptchaToken = recaptchaRef.current?.getValue()
    // if (!recaptchaToken) {
    //   toast.error('Please complete the reCAPTCHA')
    //   return
    // }

    //  username from email + random number 1-99
    const username =
      data.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 10) +
      "-" +
      Math.floor(Math.random() * 9 + 1);

    const sendCodeData = {
      username,
      email: data.email,
      // recaptchaToken,
      type: "waitlist",
      ...(referralCode && { referralCode }),
    };

    sendCodeMutation.mutate(sendCodeData as any);
  };

  const handleResendCode = () => {
    // const recaptchaToken = recaptchaRef.current?.getValue()
    // if (!recaptchaToken) {
    //   toast.error('Please complete the reCAPTCHA')
    //   return
    // }

    const sendCodeData = {
      email: email,
      // recaptchaToken,
      type: "waitlist",
      ...(referralCode && { referralCode }),
    };

    sendCodeMutation.mutate(sendCodeData as any);
  };

  const isLoading = sendCodeMutation.isPending;

  return (
    <div
      className="min-h-screen w-screen grid lg:grid-cols-2 items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/waitlist/main-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* DESKTOP */}

      <div className="hidden lg:block">
        <div className="text-center text-white max-w-4xl mx-auto px-10">
          <img
            src="/images/auth/reward-amount.png"
            alt="$1,000,000"
            className="max-w-full h-auto max-h-48 md:max-h-64 lg:max-h-80 object-contain"
          />

          <div className="text-2xl md:text-5xl font-black mb-8">
            <span className="bg-gradient-to-b from-pink-1 to-pink-2 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]">
              IN PRIZES
            </span>
          </div>

          {/* Bottom bullet points */}
          <div className="flex items-center justify-center space-x-4 text-sm md:text-lg mb-12 font-bold text-[#E4D1E6]">
            <span>JACKPOTS</span>
            <span>•</span>
            <span>MYSTERY DROPS</span>
            <span>•</span>
            <span>DAILY REWARDS</span>
          </div>

          <div className="mb-5  w-full">
            <div className="flex gap-2 mb-5">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="max-w-md h-13 border-white/30 backdrop-blur-lg"
              />
              <Button
                className="h-13 uppercase font-bold glow"
                variant={"purple"}
                onClick={() => onSignupSubmit({ email })}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Join the waitlist / login"
                )}
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex-1 h-px bg-white/30"></div>
              <span className="px-4 text-white text-sm font-medium">
                Or join with
              </span>
              <div className="flex-1 h-px bg-white/30"></div>
            </div>
          </div>

          <div className="flex gap-2  ">
            <Button variant="purple" size={"icon"}>
              <GoogleIcon className="w-6 h-6" />
            </Button>
            <Button variant="purple" size={"icon"}>
              <XIcon className="w-6 h-6" />
            </Button>
            <Button variant="purple" size={"icon"}>
              <TelegramIcon className="w-6 h-6" />
            </Button>
            <Button variant="purple" size={"icon"}>
              <DiscordIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <img
          src="/images/waitlist/yoni.png"
          alt="yuni"
          className="absolute bottom-0 left-[40%] w-4xl object-cover"
        />
      </div>

      {/* MOBILE */}
      <div className="block lg:hidden pt-20">
        <div className="text-center text-white">
          {/* Main dollar amount image */}
          <div className="flex justify-center mb-4">
            <img
              src="/images/auth/reward-amount.png"
              alt="$1,000,000"
              className="max-w-full h-auto max-h-48 md:max-h-64 lg:max-h-80 object-contain"
            />
          </div>

          {/* "IN PRIZES" text */}
          <div className="text-2xl md:text-5xl font-black mb-8">
            <span className="bg-gradient-to-b from-pink-400 to-white bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]">
              IN PRIZES
            </span>
          </div>

          {/* Bottom bullet points */}
          <div className="flex items-center justify-center space-x-2 text-xs md:text-base  font-bold text-[#E4D1E6]">
            <span>JACKPOTS</span>
            <span>•</span>
            <span>MYSTERY DROPS</span>
            <span>•</span>
            <span>DAILY REWARDS</span>
          </div>

          <img
            src="/images/waitlist/yoni.png"
            alt="yuni"
            className="w-full object-cover mb-2 max-w-82 mx-auto"
          />

          {/* Custom Input Component */}
          <div className="mb-8 px-8 flex gap-2 flex-col justify-center">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="max-w-md h-13 border-white/30 backdrop-blur-lg"
            />
            <Button
              className="h-13 uppercase font-bold glow"
              variant={"purple"}
              onClick={() => onSignupSubmit({ email })}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Join the waitlist / login"
              )}
            </Button>
          </div>

          {/* Or join with separator */}
          <div className="flex items-center justify-center mb-6 px-8">
            <div className="flex-1 h-px bg-white/30"></div>
            <span className="px-4 text-white text-sm font-medium">
              Or join with
            </span>
            <div className="flex-1 h-px bg-white/30"></div>
          </div>

          <div className="flex gap-2  justify-center">
            <Button variant="purple" size={"icon"}>
              <GoogleIcon className="w-6 h-6" />
            </Button>
            <Button variant="purple" size={"icon"}>
              <XIcon className="w-6 h-6" />
            </Button>
            <Button variant="purple" size={"icon"}>
              <TelegramIcon className="w-6 h-6" />
            </Button>
            <Button variant="purple" size={"icon"}>
              <DiscordIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <VerificationModal
        open={isOTPModalOpen}
        onOpenChange={setIsOTPModalOpen}
        email={email}
        type={"waitlist"}
        onResendCode={handleResendCode}
      />
    </div>
  );
};

export default Auth;
