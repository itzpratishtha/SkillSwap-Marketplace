import { useEffect, useState } from "react";
import profileAPI from "../../api/profile.api";
import Loader from "../../components/ui/Loader";
import BasicInfo from "../../components/profile/BasicInfo";
import SkillsSection from "../../components/profile/SkillSection";
import AddSkillModal from "../../components/profile/AddSkillModal";
import SocialLinks from "../../components/profile/SocialLinks";
import Availability from "../../components/profile/Availability";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [teachModalOpen, setTeachModalOpen] = useState(false);
    const [learnModalOpen, setLearnModalOpen] = useState(false);
    const { refreshUser } = useAuth();

    useEffect(() => {

        loadProfile();

    }, []);

    async function loadProfile() {

        try {

            const res = await profileAPI.getProfile();

            setProfile(res.user);

        } catch (error) {

    const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

    alert(message);

}finally {

            setLoading(false);

        }

    }

    if (loading) return <Loader />;

    if (!profile) {

        return (
            <div className="text-center mt-20 text-red-500">
                Unable to load profile.
            </div>
        );

    }
    const removeTeachSkill = (index) => {
    setProfile((prev) => ({
        ...prev,
        skillsTeach: prev.skillsTeach.filter((_, i) => i !== index),
    }));
};

const removeLearnSkill = (index) => {
    setProfile((prev) => ({
        ...prev,
        skillsLearn: prev.skillsLearn.filter((_, i) => i !== index),
    }));
};

const handleSave = async () => {

    try {
        if (profile.skillsTeach.length === 0) {
    alert("Add at least one teaching skill.");
    return;
}

if (profile.skillsLearn.length === 0) {
    alert("Add at least one learning skill.");
    return;
}

        const res = await profileAPI.updateProfile(profile);

        alert(res.message);

        await refreshUser();

    } catch (error) {

    const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

    alert(message);

}

};


    return (

        <div className="w-full max-w-5xl mx-auto space-y-5 sm:space-y-6">

    <h1 className="text-2xl sm:text-3xl font-bold">
    My Profile
</h1>

{!profile.welcomeCreditsClaimed && (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-5 sm:p-6 shadow-sm">
        
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl" />
        <div className="absolute -left-8 -bottom-8 h-20 w-20 rounded-full bg-teal-200/30 blur-2xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
            
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">
                🎁
            </div>

            <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                    Complete your profile & earn 10 Skill Credits!
                </h2>

                <p className="mt-1 text-sm sm:text-base text-slate-600">
                    Add your skills, availability and social profile to unlock
                    your one-time welcome reward.
                </p>
            </div>

            <div className="flex-shrink-0">
                <span className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm">
                    +10 Credits
                </span>
            </div>

        </div>
    </div>
)}

    <BasicInfo
        profile={profile}
        setProfile={setProfile}
    />
    <SkillsSection
    title="Skills I Teach"
    skills={profile.skillsTeach}
    buttonText="+ Add Skill"
    onAdd={() => setTeachModalOpen(true)}
    onDelete={removeTeachSkill}
/>

<SkillsSection
    title="Skills I Want to Learn"
    skills={profile.skillsLearn}
    buttonText="+ Add Skill"
    onAdd={() => setLearnModalOpen(true)}
    onDelete={removeLearnSkill}
/>

<AddSkillModal
    open={teachModalOpen}
    onClose={() => setTeachModalOpen(false)}
    existingSkills={profile.skillsTeach}
    mode="teach"
    onSave={(skill) => {
        setProfile({
            ...profile,
            skillsTeach: [
                ...profile.skillsTeach,
                skill,
            ],
        });
    }}
/>

<AddSkillModal
    open={learnModalOpen}
    onClose={() => setLearnModalOpen(false)}
    existingSkills={profile.skillsLearn}
    mode="learn"
    onSave={(skill) => {
        setProfile({
            ...profile,
            skillsLearn: [
                ...profile.skillsLearn,
                skill,
            ],
        });
    }}
/>

<SocialLinks
    profile={profile}
    setProfile={setProfile}
/>

<Availability
    profile={profile}
    setProfile={setProfile}
/>

    <div className="flex justify-stretch sm:justify-end">

    <button
        onClick={handleSave}
        className="
            w-full
            sm:w-auto
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            px-8
            py-3
            rounded-xl
            transition
        "
    >
        Save Changes
    </button>

</div>

</div>

    );

}