import AdvancedDemoClient from './AdvancedDemoClient';

// Required for static export
export const dynamic = 'force-static';
export const revalidate = false;

export default function AdvancedDemoPage() {
  return <AdvancedDemoClient />;
}
