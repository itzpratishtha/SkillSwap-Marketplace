import Input from "../ui/Input";

export default function SocialLinks({ profile, setProfile }) {

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">

           <h2 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6">
                Social Links
            </h2>

            <div className="space-y-5">

                <Input
                    label="GitHub"
                    name="github"
                    value={profile.github || ""}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                />

                <Input
                    label="LinkedIn"
                    name="linkedin"
                    value={profile.linkedin || ""}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                />

                <Input
                    label="Portfolio"
                    name="portfolio"
                    value={profile.portfolio || ""}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                />

            </div>

        </div>
    );
}