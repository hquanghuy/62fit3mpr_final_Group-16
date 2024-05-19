class Note {
  constructor(id, color, labelIds, content, updatedAt, isBookmarked) {
    this.id = id;
    this.color = color;
    this.labelIds = labelIds;
    this.content = content;
    this.updatedAt = updatedAt;
    this.isBookmarked = isBookmarked;
  }
}

export default Note;
