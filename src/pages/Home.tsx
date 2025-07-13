import React, { useState } from 'react';
import Header from '../components/Header';
import Work from '../components/Work';
import Footer from '../components/Footer';

export default function Home() {
  const [order, setOrder] = useState<'relevancy' | 'latest'>('latest');
  return (
    <>
      <Header order={order} setOrder={setOrder} />
      <main>
        <Work order={order} />
      </main>
      <Footer />
    </>
  );
}