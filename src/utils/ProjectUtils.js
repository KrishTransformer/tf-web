export const projectAggrByTasks = (data) => {
  if (data?.length == 0) {
    return data;
  } else {
    let outputResult = data?.reduce((acc, item) => {
      if (Object.entries(acc)?.length == 0) {
        acc = [];
      }
      let currentItem = {};
      currentItem.taskName = item?.taskName;
      currentItem.hours = item?.hours;
      currentItem.collapseContent = [];
      let member1 = {
        memberName: item?.name,
        hours: item?.hours,
      };
      const result = acc.some((i) => i?.taskName === item?.taskName);
      if (result) {
        const index = acc.findIndex((i) => i?.taskName === item?.taskName);
        if (index !== -1) {
          acc[index].hours = +acc[index].hours + +currentItem?.hours;
          const collapMatch = acc[index].collapseContent.some(
            (i) => i?.memberName === item?.name
          );
          if (collapMatch) {
            const collapIndex = acc[index].collapseContent.findIndex(
              (i) => i?.memberName === item?.name
            );
            if (collapIndex !== -1) {
              acc[index].collapseContent[collapIndex].hours =
                +acc[index].collapseContent[collapIndex].hours + +item?.hours;
            }
          } else {
            acc[index].collapseContent.push(member1);
          }
        }
      } else {
        currentItem.collapseContent.push(member1);
        acc.push(currentItem);
      }
      return acc;
    }, {});
    return outputResult;
  }
};


export const projectAggrByTeam = (data) => {
  if (data.length == 0) {
    return data;
  } else {
    let outputResult = data?.reduce((acc, item) => {
      if (Object.entries(acc)?.length == 0) {
        acc = [];
      }
      let currentItem = {};
      currentItem.name = item?.name;
      currentItem.hours = item?.hours;
      currentItem.collapseContent = [];
      let member1 = {
        taskName: item?.taskName,
        hours: item?.hours,
      };
      const result = acc.some((i) => i?.name === item?.name);
      if (result) {
        const index = acc.findIndex((i) => i?.name === item?.name);
        if (index !== -1) {
          acc[index].hours = +acc[index].hours + +currentItem?.hours;
          const collapMatch = acc[index].collapseContent.some(
            (i) => i?.taskName === item?.taskName
          );
          if (collapMatch) {
            const collapIndex = acc[index].collapseContent.findIndex(
              (i) => i?.taskName === item?.taskName
            );
            if (collapIndex !== -1) {
              acc[index].collapseContent[collapIndex].hours =
                +acc[index].collapseContent[collapIndex].hours + +item?.hours;
            }
          } else {
            acc[index].collapseContent.push(member1);
          }
        }
      } else {
        currentItem.collapseContent.push(member1);
        acc.push(currentItem);
      }
      return acc;
    }, {});
    return outputResult;
  }
};