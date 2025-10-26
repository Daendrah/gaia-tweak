import Toolbar from '@/components/features/Editor/Toolbar';
import Viewport from '@/components/features/Editor/Viewport';

export default function Editor() {
  return (
    <main style={{ flex: 1 }}>
      <Viewport />
      <Toolbar />
    </main>
  );
}
