import type { Meta, StoryFn } from '@storybook/react';
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
} as Meta<typeof SearchModal>;

const SearchModalTemplate: StoryFn<typeof SearchModal> = (args) => {
    const [modalOpen, setModalOpen] = useState(false);

    function toggleModalOpen() {
        setModalOpen(!modalOpen);
    }

    function handleOpenChange(open: boolean) {
        setModalOpen(open);
    }

    return (
        <div className="p-12">
            <Button onClick={toggleModalOpen}>Open search modal</Button>
            <SearchModal {...args} isOpen={modalOpen} onOpenChange={handleOpenChange} />
        </div>
    );
};

export const Default = SearchModalTemplate.bind({});
Default.args = {
    // using config values for The Goodnewsroom
    algoliaConfig: {
        ALGOLIA_API_KEY:
            'NTI4YjFkN2RhNjU0NzIxOGUzMjQzMmQ0MTgwNjk1OWNjMmUzZTQzMTQ1ZWMzNjhlZDNhN2ExMGI2OTIzMDZmNXRhZ0ZpbHRlcnM9JTVCJTIybGljZW5zZV82MzM3JTIyJTJDJTIybmV3c3Jvb21fMTI2OTglMjIlNUQ=',
        ALGOLIA_APP_ID: 'UI4CNRAHQB',
        ALGOLIA_INDEX: 'public_stories_prod',
    },
    newsroomName: 'Test site',
    locale: 'en',
    categories: CATEGORIES,
    logo: null,
    hideSubtitle: false,
    showDate: true,
};
