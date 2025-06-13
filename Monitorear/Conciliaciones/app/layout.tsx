import '@/app/global.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import Layout from '@/components/ui/layout';
import { ChakraProvider } from '@chakra-ui/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Conciliaciones',
  description:
    'Aplicación desde la que puntear apuntes contables, movimientos bancarios y otros elementos contables para llevar un control exhaustivo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
          <Layout>
            <ChakraProvider>
              {children}
            </ChakraProvider>
          </Layout>
      </body>
    </html>
  );
}
