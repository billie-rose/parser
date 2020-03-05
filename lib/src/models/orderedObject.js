class OrderedObject {
    properties;

    constructor(properties) {
        this.properties = Set(properties).sort((a, b) => a.order - b.order);
    }
}
