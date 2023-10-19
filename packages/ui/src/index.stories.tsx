import type { Meta, StoryObj } from '@storybook/react';

function StubComponent() {
    return (
        <div>
            This is a stub Story to fix Chromatic build failing. Remove it once we have some
            components implemented
        </div>
    );
}

const meta = {
    title: 'Stub Story',
    component: StubComponent,
} as Meta<typeof StubComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
