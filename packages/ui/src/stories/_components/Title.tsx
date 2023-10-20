interface Props {
    title: string;
    description: string;
}

export function Title({ title, description }: Props) {
    return (
        <>
            <h3 className="text-2xl font-medium text-gray-800">{title}</h3>
            <h4 className=" text-lg mb-0 leading-5 text-gray-500">{description}</h4>
        </>
    );
}
