let partitionCounter = 1;

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function splitPartition(id, direction) {
  const parent = document.getElementById(id);
  const newPartitionId1 = `partition-${partitionCounter++}`;
  const newPartitionId2 = `partition-${partitionCounter++}`;

  const partition1 = document.createElement("div");
  partition1.classList.add("partition");
  partition1.style.backgroundColor = parent.style.backgroundColor;
  partition1.id = newPartitionId1;

  const partition2 = document.createElement("div");
  partition2.classList.add("partition");
  partition2.style.backgroundColor = getRandomColor();
  partition2.id = newPartitionId2;

  parent.innerHTML = "";
  parent.appendChild(partition1);
  parent.appendChild(partition2);

  if (direction === "vertical") {
    partition1.style.width = "50%";
    partition1.style.height = "100%";
    partition2.style.width = "50%";
    partition2.style.height = "100%";
  } else {
    partition1.style.width = "100%";
    partition1.style.height = "50%";
    partition2.style.width = "100%";
    partition2.style.height = "50%";
  }

  parent.style.display = "flex";
  parent.style.flexDirection = direction === "vertical" ? "row" : "column";

  addControls(partition1, newPartitionId1);
  addControls(partition2, newPartitionId2);
}

function addControls(partition, id) {
  const controls = document.createElement("div");
  controls.classList.add("controls");

  const btnV = document.createElement("button");
  btnV.innerText = "V";
  btnV.classList.add("btn-v");
  btnV.onclick = () => splitPartition(id, "vertical");

  const btnH = document.createElement("button");
  btnH.innerText = "H";
  btnH.classList.add("btn-h");
  btnH.onclick = () => splitPartition(id, "horizontal");

  const btnRemove = document.createElement("button");
  btnRemove.innerText = "-";
  btnRemove.classList.add("btn-remove");
  btnRemove.onclick = () => removePartition(id);

  controls.appendChild(btnV);
  controls.appendChild(btnH);
  controls.appendChild(btnRemove);

  partition.appendChild(controls);
  partition.classList.add("partition-resizable");

  interact(partition).resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
      move(event) {
        let { x, y } = event.target.dataset;

        x = (parseFloat(x) || 0) + event.deltaRect.left;
        y = (parseFloat(y) || 0) + event.deltaRect.top;

        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`,
          transform: `translate(${x}px, ${y}px)`,
        });

        Object.assign(event.target.dataset, { x, y });
      },
    },
    modifiers: [
      interact.modifiers.restrictEdges({
        outer: "parent",
        endOnly: true,
      }),
      interact.modifiers.restrictSize({
        min: { width: 50, height: 50 },
      }),
    ],
    inertia: true,
  });
}

function removePartition(id) {
  const partition = document.getElementById(id);
  partition.remove();
}

document.getElementById("initial").style.backgroundColor = getRandomColor();
document
  .querySelector(".btn-v")
  .addEventListener("click", () => splitPartition("initial", "vertical"));
document
  .querySelector(".btn-h")
  .addEventListener("click", () => splitPartition("initial", "horizontal"));
document
  .querySelector(".btn-remove")
  .addEventListener("click", () => removePartition("initial"));
