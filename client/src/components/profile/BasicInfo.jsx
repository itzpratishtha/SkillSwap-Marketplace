import Input from "../ui/Input";

export default function BasicInfo({ profile, setProfile }) {

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">

            <h2 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6">
                Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

                <Input
                    label="Full Name"
                    name="name"
                    value={profile.name || ""}
                    onChange={handleChange}
                />

                <Input
                    label="Email"
                    name="email"
                    value={profile.email || ""}
                    disabled
                />

            </div>

            <div className="mt-5">

                <Input
                    label="Profile Type"
                    name="role"
                    value={profile.role || ""}
                    disabled
                />

            </div>

            <div className="mt-5">

                <label className="block text-sm font-medium mb-2">
                    Bio
                </label>

                <textarea
                    name="bio"
                    rows={4}
                    value={profile.bio || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Tell others about yourself..."
                />

            </div>

        </div>
    );
}