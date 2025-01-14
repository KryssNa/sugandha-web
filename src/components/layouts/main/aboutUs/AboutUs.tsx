import AboutUsSection from '@/components/sections/aboutus/AboutUsSection'
import { DynamicBreadcrumb } from '@/components/shared/breadcrumb/dynamicBreadcrumb'

const AboutUsPage = () => {
    return (
        <div>
            <DynamicBreadcrumb />
            <AboutUsSection />
        </div>
    )
}

export default AboutUsPage
