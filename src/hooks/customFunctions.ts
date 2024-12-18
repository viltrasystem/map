import { NodeData } from "../lib/types";
import { CheckedNode } from "../slices/unitTreeSlice";

// recursive function to update children
export function updateChildren(
  children: NodeData[] | undefined,
  targetId: number,
  newChildren: NodeData[]
): NodeData[] | undefined {
  const childrenState = children?.map((child: NodeData) => {
    if (child.UnitID === targetId) {
      return {
        ...child,
        IsExpanded: true,
        Children: [...newChildren],
      };
    } else if (child.Children) {
      return {
        ...child,
        Children: updateChildren(child.Children, targetId, newChildren),
      };
    }
    //  console.log(child, "child each");
    return child;
  });
  return childrenState;
}

// set each unit expand status(iterrating from root)
export function updateExpandStatus(
  node: NodeData,
  targetId: number,
  isExpand: boolean
): NodeData {
  if (node.UnitID === targetId) {
    return {
      ...node,
      IsExpanded: isExpand,
    };
  } else if (node.Children && node.Children.length > 0) {
    return {
      ...node,
      Children: node.Children.map((childNode) =>
        updateExpandStatus(childNode, targetId, isExpand)
      ),
    };
  }
  return node;
}

export function findObjectById(
  node: NodeData,
  unitId: number
): NodeData | undefined {
  if (node.UnitID === unitId) {
    return node;
  }
  if (node.Children && node.Children.length > 0) {
    for (const child of node.Children) {
      const foundObject = findObjectById(child, unitId);
      if (foundObject) {
        return foundObject;
      }
    }
  }
  return undefined;
}

export function findChildCheckedNodeExist(
  node: NodeData,
  checkedNodes: CheckedNode[],
  selectionType: number
): boolean {
  if (node.Children && node.Children.length > 0 && checkedNodes) {
    for (const checkedNode of checkedNodes) {
      if (
        node.UnitID === checkedNode.ParentId &&
        checkedNode.IsChecked &&
        checkedNode.LandTypeId === selectionType
      ) {
        return true;
      }
    }
  }
  return false;
}

export function findParentCheckedNodeExist(
  node: NodeData,
  checkedNodes: CheckedNode[],
  selectionType: number
): boolean {
  if (node && checkedNodes) {
    for (const checkedNode of checkedNodes) {
      if (
        node.ParentID === checkedNode.UnitId &&
        checkedNode.IsChecked &&
        checkedNode.LandTypeId === selectionType
      ) {
        return true;
      }
    }
  }
  return false;
}

// export const getCookie = (name: string) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
//   return null;
// };

export const getCookieValue = (name: string) => {
  // Split cookie string and get all individual name=value pairs in an array
  const cookieArr = document.cookie.split(";");

  // Loop through the array elements
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split("=");

    // Remove whitespace from the beginning of the cookie name and compare it with the given name
    if (name === cookiePair[0].trim()) {
      // Return the cookie value
      return cookiePair[1];
    }
  }

  // Return null if cookie is not found
  return null;
};

export const getCookie = (name: string) => {
  const cookieName = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
};

// const token = document.cookie.split('; ').find(cookie => cookie.startsWith('jwt='));

// if (token) {
//   // Extract the token value
//   const jwtToken = token.split('=')[1];

export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
