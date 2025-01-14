import TrackOrderPage from '@/components/layouts/main/trackorder/TrackOrder'

interface Params {
    id: string;
}


export default function page({ params }: { params: Params }) {
    const { id } = params;
    return (
        <div>
            <TrackOrderPage key={1}  />
        </div>
    )
}
