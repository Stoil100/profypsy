import ApplianceForm from "@/components/schemas/appliance";

export default function Appliance() {
    return (
        <main className="flex h-full min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#40916C] to-[#52B788] py-[10vh]">
            <ApplianceForm className="w-full sm:w-[500px] md:w-[600px] lg:w-[700px]" />
        </main>
    );
}
