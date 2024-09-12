// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import styles from "./SortableItem.module.scss"; // 必要に応じてスタイルファイルも追加

// export const SortableItem = ({
//   id,
//   subtitle,
//   index,
//   handleSubtitleEdit,
//   toggleEditMode,
//   handleDeleteSubtitle,
//   setCurrentTimeForSubtitle,
//   handleSubtitleTimeChange,
//   isPlaying,
//   currentTime,
// }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <div
//         className={styles.subtitleItem}
//         style={{
//           display: isPlaying
//             ? currentTime >= subtitle.startTime &&
//               currentTime <= subtitle.endTime &&
//               !(index > 0 && currentTime < 1.0)
//               ? "block"
//               : "none"
//             : "block",
//         }}
//       >
//         {subtitle.isEditing ? (
//           <input
//             type="text"
//             value={subtitle.text}
//             onChange={(e) => handleSubtitleEdit(index, e.target.value)}
//             onBlur={() => toggleEditMode(index, false)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 toggleEditMode(index, false);
//               }
//             }}
//             className={styles.editableSubtitleInput}
//           />
//         ) : (
//           <p onClick={() => toggleEditMode(index, true)}>{subtitle.text}</p>
//         )}
//         {!isPlaying && (
//           <button
//             className={styles.deleteButton}
//             onClick={() => handleDeleteSubtitle(index)}
//           >
//             ×
//           </button>
//         )}
//         {!isPlaying && (
//           <div className={styles.tbox}>
//             <div className={styles.timebox}>
//               <button
//                 className={styles.setTimeButton}
//                 onClick={() => setCurrentTimeForSubtitle(index, "start")}
//               >
//                 START
//               </button>
//               <input
//                 className={styles.startbox}
//                 type="number"
//                 value={subtitle.startTime}
//                 onChange={(e) =>
//                   handleSubtitleTimeChange(
//                     index,
//                     Number(e.target.value),
//                     subtitle.endTime
//                   )
//                 }
//                 step="0.1"
//               />
//               /秒
//             </div>
//             <div className={styles.timebox}>
//               <button
//                 className={styles.setTimeButton}
//                 onClick={() => setCurrentTimeForSubtitle(index, "end")}
//               >
//                 END
//               </button>
//               <input
//                 className={styles.endbox}
//                 type="number"
//                 value={subtitle.endTime}
//                 onChange={(e) =>
//                   handleSubtitleTimeChange(
//                     index,
//                     subtitle.startTime,
//                     Number(e.target.value)
//                   )
//                 }
//                 step="0.1"
//               />
//               /秒
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
