"use client";
import React, { ReactNode } from "react";
import { PageProvider } from "@/contexts/PageContext";
import { SolanaWalletProvider } from "@/contexts/SolanaWalletProvider";
import { ToastContainer } from "react-toastify";
import { ModalProvider } from "@/contexts/ModalProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SolanaWalletProvider>
      <ModalProvider>
        <PageProvider>
          {children}
          <ToastContainer
            pauseOnFocusLoss={false}
            theme="colored"
            closeOnClick
          />
        </PageProvider>
      </ModalProvider>
    </SolanaWalletProvider>
  );
}
