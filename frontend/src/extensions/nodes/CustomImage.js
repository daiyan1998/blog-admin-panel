import { Node } from "@tiptap/core";

const CustomImage = Node.create({
  name: "customImage",

  group: "block",

  draggable: true,

  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", { ...HTMLAttributes, class: "custom-image" }];
  },

  //   addNodeView() {
  //     return ({ node, getPos, editor }) => {
  //       const dom = document.createElement('div');
  //       dom.style.position = 'relative';

  //       const img = document.createElement('img');
  //       img.src = node.attrs.src;
  //       dom.appendChild(img);

  //         const deleteButton = document.createElement('button');
  //         deleteButton.textContent = '×';
  //         deleteButton.style.position = 'absolute';
  //         deleteButton.style.top = '0';
  //         deleteButton.style.right = '0';
  //         deleteButton.style.cursor = 'pointer';

  //         deleteButton.addEventListener('click', () => {
  //           const { tr } = editor.state;
  //           const pos = getPos();
  //           editor.view.dispatch(tr.delete(pos, pos + node.nodeSize));
  //         });

  //         dom.appendChild(deleteButton);

  //       return { dom };
  //     };
  //   },
});

export default CustomImage;
