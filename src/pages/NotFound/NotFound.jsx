import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import Button from '@/components/Button/Button';

const NotFound = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem 1.5rem', background: '#f7f6f2', textAlign: 'center', gap: '1.5rem' }}>
    <Link to="/"><Logo /></Link>
    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '5rem', letterSpacing: '-0.04em', color: '#0f4c3a', fontWeight: 700, lineHeight: 1 }}>404</h1>
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.875rem', color: '#0d1f1c', fontWeight: 600, letterSpacing: '-0.02em' }}>This page took a wrong turn.</h2>
    <p style={{ color: '#6b7672', maxWidth: '40ch', lineHeight: 1.6 }}>
      The page you're looking for doesn't exist, or it may have been moved. Let's get you back on track.
    </p>
    <Button to="/" iconLeft={<ArrowLeft size={16} />}>Back to home</Button>
  </div>
);

export default NotFound;
