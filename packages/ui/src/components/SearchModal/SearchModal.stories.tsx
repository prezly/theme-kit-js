import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../Button';
import { CATEGORIES } from '../Navigation/__mocks__';

import { SearchModal } from './SearchModal';

export default {
    title: 'Components/SearchModal',
    component: SearchModal,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=1982-69220&mode=dev',
        },
        layout: 'fullscreen',
    },
} satisfies Meta<typeof SearchModal>;

const DISPLAYED_CATEGORIES: SearchModal.DisplayedCategory[] = CATEGORIES.map((category) => ({
    id: category.id,
    name: category.display_name,
    description: category.display_description,
    href: `/category/${category.display_name.toLowerCase().replace(' ', '-')}`,
}));

const SearchModalTemplate: StoryFn<typeof SearchModal> = (args) => {
    const [modalOpen, setModalOpen] = useState(false);

    function toggleModalOpen() {
        setModalOpen(!modalOpen);
    }

    function handleToggle(open: boolean) {
        setModalOpen(open);
    }

    return (
        <div className="p-12">
            <Button onClick={toggleModalOpen}>Open search modal</Button>
            <SearchModal {...args} isOpen={modalOpen} onToggle={handleToggle} />
        </div>
    );
};

export const Default: StoryObj<typeof SearchModal> = SearchModalTemplate.bind({});
Default.args = {
    // using config values for The Goodnewsroom
    algoliaConfig: {
        apiKey: 'NTI4YjFkN2RhNjU0NzIxOGUzMjQzMmQ0MTgwNjk1OWNjMmUzZTQzMTQ1ZWMzNjhlZDNhN2ExMGI2OTIzMDZmNXRhZ0ZpbHRlcnM9JTVCJTIybGljZW5zZV82MzM3JTIyJTJDJTIybmV3c3Jvb21fMTI2OTglMjIlNUQ=',
        appId: 'UI4CNRAHQB',
        index: 'public_stories_prod',
    },
    newsroomName: 'Test site',
    locale: 'en',
    categories: DISPLAYED_CATEGORIES,
    logo: null,
    showSubtitle: true,
    showDate: true,
};
