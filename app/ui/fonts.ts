import { Inter, Lusitana } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

// Secondary typeface: Lusitana with regular (400) and bold (700)
export const lusitana = Lusitana({
	subsets: ['latin'],
	weight: ['400', '700'],
});