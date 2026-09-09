import Input from "../ui/Input";

export default function Availability({ profile, setProfile }) {

    return (

<div className="bg-white rounded-xl shadow p-4 sm:p-6">

            <h2 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6">
                Availability
            </h2>

            <Input
                label="Availability"
                name="availability"
                value={profile.availability || ""}
                onChange={(e) =>
                    setProfile({
                        ...profile,
                        availability: e.target.value,
                    })
                }
                placeholder="Weekdays 6 PM - 9 PM"
            />

        </div>

    );

}