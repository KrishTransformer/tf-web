import React from "react";
import Icons from "../Icons";
import {
	Path,
	RouterBreadCrumb,
	ThinHeaderContainer,
} from "../../styles/components/Header.styles";
import {
	LastSyncedText,
	PathBreadCrumbText,
} from "../../styles/components/Label.styles";


const ThinHeader = ({
	navigate,
	prevPath,
	currentPath,
	prevPage,
	additionalControls,
	onRefresh,
	otherPaths = [],
}) => (
	<ThinHeaderContainer flexDirection="row">
		<RouterBreadCrumb>
			<PathBreadCrumbText onClick={() => navigate("/home")}>
				Designs
			</PathBreadCrumbText>
			<Icons themeSize="large" name="arrow_right" />{" "}
			{otherPaths.map(({ pathName, path, state }) => (
				<React.Fragment key={pathName}>
					<PathBreadCrumbText onClick={() => navigate(path, state)}>
						{pathName}
					</PathBreadCrumbText>
					<Icons themeSize="large" name="arrow_right" />
				</React.Fragment>
			))}
			{prevPath && (
				<PathBreadCrumbText onClick={() => navigate(prevPage)}>
					{prevPath}
				</PathBreadCrumbText>
			)}
			{prevPath && <Icons themeSize="large" name="arrow_right" />}
			<PathBreadCrumbText isCurrentPage>{currentPath}</PathBreadCrumbText>
		</RouterBreadCrumb>
		{/* <Controls>
			{additionalControls && <div> {additionalControls}</div>}
			&nbsp; &nbsp;
			<LastSyncedText>{`Last Updated ${lastUpdatedAt}`}</LastSyncedText>
			&nbsp; &nbsp;{" "}
			<TextButton onClick={onRefresh}>
				<Icons themeSize="large" name="refresh" />
			</TextButton>
		</Controls> */}
	</ThinHeaderContainer>
);
export default React.memo(ThinHeader);
