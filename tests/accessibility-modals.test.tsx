import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Modal } from '@/components/ui/Modal';

describe('Modal accessibility', () => {
  it('should call onClose when Escape is pressed and modal is open', () => {
    const onClose = vi.fn();
    const { getByText } = render(
      <Modal isOpen={true} onClose={onClose} title="Test" size="md">
        <div>Content</div>
      </Modal>
    );
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
