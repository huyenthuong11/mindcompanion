export default function LeafIcon({ size = 24, color = 'green' }) {
  return (
    <svg class="leaf-decor" width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 90C10 90 30 70 50 70C70 70 90 50 90 10" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
      <path d="M50 70C50 70 60 55 80 50C60 45 50 30 50 30C50 30 40 45 20 50C40 55 50 70 50 70Z" fill="#81C784" fill-opacity="0.6"/>
      <path d="M30 85C30 85 20 75 15 60C25 70 40 75 40 75" stroke="#4CAF50" stroke-width="1.5"/>
    </svg>
  );
}