// import React, { useState, useEffect } from "react";
// import { Avatar, Divider, Heading, Text, VStack } from "native-base";
// import { useRouter } from "expo-router";
// import { useAppDispatch, useAppSelector } from "@/src/data/hooks";
// import { updateUser } from "@/src/data/features/user/userSlice";
// import ScreenContainer from "@/src/components/ScreenContainer";
// import Header from "@/src/components/Header";
// import CustomInput from "@/src/components/input/CustomInput";

// export default function ChangePasswordScreen() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const user = useAppSelector((state)=>state.auth.user);

//   const [current, setCurrent] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
//   const [success, setSuccess] = useState(false);
//   const [isModified, setIsModified] = useState(false);

//   useEffect(() => {
//     setIsModified(
//       current.length > 0 || password.length > 0 || confirm.length > 0
//     );
//   }, [current, password, confirm]);

//   const handleSave = async () => {
//     setErrors({});
//     setSuccess(false);

//     if (password.length < 6) {
//       setErrors({ password: ["Password must be at least 6 characters"] });
//       return;
//     }

//     if (password !== confirm) {
//       setErrors({ password_confirmation: ["Passwords do not match"] });
//       return;
//     }

//     const res = await dispatch(
//       updateUser({
//         password,
//         password_confirmation: confirm,
//       })
//     );

//     if (updateUser.fulfilled.match(res)) {
//       setSuccess(true);
//       setCurrent("");
//       setPassword("");
//       setConfirm("");
//     } else if (res.payload) {
//       setErrors(res.payload as { [key: string]: string[] });
//     }
//   };

//   return (
//     <ScreenContainer variant="top">
//       <Header
//         title="Change Password"
//         onBackPress={() => router.back()}
//         rightIcon={
//           isModified ? (
//             <Text onPress={handleSave} color="blue.500">
//               Save
//             </Text>
//           ) : null
//         }
//       />

//       <VStack px={5} space={4}>
//         {user && (
//           <>
//             <VStack alignItems="center" mt={4}>
                
//                 <Heading fontSize="lg">{user.name}</Heading>
//                 <Text color="gray.500">{user.email}</Text>
//             </VStack>
            
//             <Divider my={4} />
//             <Text mb={4} fontSize="sm" textAlign="center" color="gray.500">
//               Please enter your current password and a new password below.
//             </Text>
//           </>
//         )}

//         <CustomInput
//           label="Current Password"
//           secureTextEntry
//           placeholder="Enter your current password"
//           value={current}
//           onChangeText={setCurrent}
//           error={errors.current_password?.[0]}
//         />
//         <CustomInput
//           label="New Password"
//           secureTextEntry
//           placeholder="Enter new password"
//           value={password}
//           onChangeText={setPassword}
//           error={errors.password?.[0]}
//         />
//         <CustomInput
//           label="Confirm New Password"
//           secureTextEntry
//           placeholder="Confirm new password"
//           value={confirm}
//           onChangeText={setConfirm}
//           error={errors.password_confirmation?.[0]}
//         />

//         {errors.general && (
//           <Text color="red.500" textAlign="center">
//             {errors.general}
//           </Text>
//         )}

//         {success && (
//           <Text color="green.500" textAlign="center">
//             Password updated successfully!
//           </Text>
//         )}
//       </VStack>
//     </ScreenContainer>
//   );
// }
