# UI Component Library - Complete

## Base Components

### Button
```tsx
<Button variant="primary | secondary | outline | ghost | danger" size="sm | md | lg">
  Label
</Button>
```

### Input
```tsx
<Input label="Email" placeholder="Enter email" error="Error message" helperText="Help" />
```

### Select
```tsx
<Select 
  label="Choose" 
  options={[{value: 'a', label: 'Option A'}, {value: 'b', label: 'Option B'}]} 
/>
```

### Badge
```tsx
<Badge variant="default | success | warning | error | info">Status</Badge>
```

### Modal
```tsx
<Modal isOpen={bool} onClose={() => {}} title="Title" size="sm | md | lg">
  Content
</Modal>
```

### Card
```tsx
<Card padding="none | sm | md | lg" hover>
  <CardHeader title="Title" subtitle="Subtitle" action={<Button>Action</Button>} />
  Body
</Card>
```

## Usage Examples

```tsx
import { Button, Input, Badge, Modal, Card, Select } from '@/components/ui';
```

## Files
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Select.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Modal.tsx`
- `src/components/ui/Card.tsx`
