import {
  Document,
  ExternalHyperlink,
  HeadingLevel,
  IRunPropertiesOptions,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";
import { formatDate, getImageUrl } from "./helper";
import { ROLE } from "./dic";

function formatChildren(record: any) {
  const children = [
    createHeading("任务描述"),
    new Paragraph(record.remark),
    createHeading("任务目标"),
    new Paragraph(record.targetRemark),
    createHeading("要求描述"),
    new Paragraph(record.requireRemark),
    new Paragraph(""),
    new Paragraph(`创建时间: ${formatDate(record.startTime)}`),
    new Paragraph(`完成时间: ${formatDate(record.endTime)}`),
  ];

  record.list?.forEach((child: any) => {
    children.push(
      createSubHeading(
        child.title,
        ` | 创建人: ${child.role === ROLE.ADMIN ? "管理员" : child.username}`,
      ),
    );
    children.push(new Paragraph(child.content));

    if (child.attachment.length > 0) {
      const names = child.attachment.map(
        (attachment: { name: string, uid: string }) => {
          const hyperlink = new ExternalHyperlink({
            link: getImageUrl(attachment.uid),
            children: [
                new TextRun({
                    text: attachment.name,
                    style: "Hyperlink",
                }),
            ],
        });
        return hyperlink;
        },
      );
      children.push(new Paragraph({children: [
        new TextRun("附件: "),
        ...names,
      ]}));
    }
  });

  return children;
}

export function generateDocx(data: any, fileName: string = "output") {
  const children = formatChildren(data);

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
    styles: {
      paragraphStyles: [
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true, // 快速格式化
          run: {
            size: 24, // 字号
            bold: true, // 加粗
            color: "#333333",
            // underline: { // 设置下划线  DOUBLE是双下划线
            //     type: UnderlineType.DOUBLE,
            //     color: "FF0000"
            // }
            font: {
              name: "Microsoft YaHei UI", // 设置字体
            },
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
      ],
    },
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${fileName}.docx`);
  });
}

function createHeading(text: string): Paragraph {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
  });
}

function createSubHeading(text: string, name: string): Paragraph {
  return new Paragraph({
    spacing: {
      before: 240,
      after: 120,
    },
    children: [
      new TextRun({
        text: text,
        size: 24, // 字号
        bold: true, // 加粗
        color: "#333333",
        font: {
          name: "Microsoft YaHei UI", // 设置字体
        },
      }),
      new TextRun({
        text: name,
      }),
    ],
  });
}

