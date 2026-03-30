export const theme = {
  colors: {
    primary: '#FFD602', // Original Yellow
    onPrimary: '#000000', // Black on yellow
    secondary: '#1A1A1A', // Dark accents
    secondaryContainer: '#F5F5F5', 
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceContainerLow: '#F8F9FA',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerHigh: '#E9ECEF',
    surfaceContainerHighest: '#DEE2E6',
    onSurface: '#000000',
    onSurfaceVariant: '#6C757D',
    error: '#DC3545',
    outlineVariant: 'rgba(0, 0, 0, 0.05)',
    black: '#000000',
    white: '#FFFFFF',
  },
  typography: {
    fontFamily: 'Inter',
    display: { fontSize: 36, fontWeight: '800', letterSpacing: -0.72 },
    headline: { fontSize: 28, fontWeight: '800', letterSpacing: -0.56 },
    title: { fontSize: 20, fontWeight: '700' },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    label: { fontSize: 14, fontWeight: '700' },
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    card: 16,
    button: 100, // full
  }
} as const;
