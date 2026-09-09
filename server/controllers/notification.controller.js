import {

    getNotifications,

    markNotificationRead,

    markAllNotificationsRead,

    getUnreadNotificationCount,

} from "../services/notification.service.js";

export const fetchNotifications = async (req,res)=>{

try{

const notifications=
await getNotifications(req.user._id);

return res.status(200).json({

success:true,

count:notifications.length,

notifications

});

}catch(error){

return res.status(500).json({

success:false,

message:error.message

});

}

};

export const readNotification=async(req,res)=>{

try{

const notification=
await markNotificationRead(

req.params.id,

req.user._id

);

if(!notification){

return res.status(404).json({

success:false,

message:"Notification not found."

});

}

return res.status(200).json({

success:true,

notification

});

}catch(error){

return res.status(500).json({

success:false,

message:error.message

});

}

};

export const readAllNotifications=async(req,res)=>{

try{

await markAllNotificationsRead(
req.user._id
);

return res.status(200).json({

success:true,

message:"All notifications marked as read."

});

}catch(error){

return res.status(500).json({

success:false,

message:error.message

});

}

};

export const unreadNotificationCount = async (req, res) => {

    try {

        const count = await getUnreadNotificationCount(
            req.user._id
        );

        return res.status(200).json({

            success: true,

            count

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};