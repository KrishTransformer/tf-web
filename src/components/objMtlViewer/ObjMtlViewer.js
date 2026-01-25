// import React, { useState, useRef } from "react";
// import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
// import { OrbitControls, PerspectiveCamera, SpotLight } from "@react-three/drei";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
// import "./ObjMtlViewer.css";


// const ObjViewer = ({ objPath, mtlPath }) => {
//   // Load materials and object
//   const materials = useLoader(MTLLoader, mtlPath);
//   const object = useLoader(OBJLoader, objPath, (loader) => {
//     materials.preload();
//     loader.setMaterials(materials);
//   });

//   return <primitive object={object} scale={15} />;
// };

// const ObjMtlViewer = ({designId}) => {

//   const mtlUrl = "https://s3.ap-south-1.amazonaws.com/transformer.riverworld.io/" + designId + "/" + designId + ".mtl";
//   const  objUrl = "https://s3.ap-south-1.amazonaws.com/transformer.riverworld.io/" + designId + "/" + designId + ".obj";
//   return (
//     <>
//       <Canvas resize={{scroll: false}}>
//         {/* <ambientLight intensity={0.5} /> */}

//         <ambientLight intensity={1.5} />
//         <directionalLight position={[2, 5, 1]} />
//         {/*   <SpotLight position={[10, 15, 10]} angle={0.3} />
//         <pointLight position ={[5,5,5]} intensity ={1} />
//       <pointLight position ={[-3,-3,2]} intensity ={1} /> */}
//         {/* <PerspectiveCamera  position={[10, 0, 0]} // Dynamic position */}
//         {/* makeDefault
//       /> */}
//         <ObjViewer
//           objPath={objUrl}
//           mtlPath={mtlUrl}
//         />
//         {/* <Environment preset = 'sunset'/> */}

//         <OrbitControls />
//       </Canvas>    
//     </>
//   );
// };





// export default ObjMtlViewer;
