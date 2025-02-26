import { Suspense } from 'react';
import ContentDetailsClient from './ContentDetailsClient';

export default function ContentDetailsPage({ params }: { params: { type: string; id: string } }) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <ContentDetailsClient type={params.type} id={params.id} />
    </Suspense>
  );
} 