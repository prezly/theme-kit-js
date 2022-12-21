export interface PaginationProps {
    itemsTotal: number;
    currentPage: number;
    pageSize: number;
    /**
     * When set to `true`, the calculated offset will be increased by one to account for the highlighted story
     */
    useHighlightedStory?: boolean;
}
