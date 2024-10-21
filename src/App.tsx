import {
    Admin,
    AutocompleteArrayInput,
    CreateParams,
    Datagrid,
    Edit,
    List,
    NumberInput,
    Resource,
    SimpleForm,
    TextField,
    TextInput,
    UpdateParams
} from "react-admin";
import fakeDataProvider from "ra-data-fakerest";
import {ReferenceManyToManyInput, ReferenceOneInput} from '@react-admin/ra-relationships';

export const BandEdit = () => (
    <Edit mutationMode="pessimistic">
        <SimpleForm>
            <TextInput source="name"/>
            <ReferenceManyToManyInput
                reference="venues"
                through="performances"
                using="band_id,venue_id"
            >
                <AutocompleteArrayInput
                    label="Performances"
                    optionText="name"
                />
            </ReferenceManyToManyInput>
            <ReferenceOneInput reference="band_details" target="band_id">
                <TextInput source="biography"/>
                <TextInput source="style"/>
                <TextInput source="status"/>
                <NumberInput source="formed_in"/>
                <TextInput source="country"/>
            </ReferenceOneInput>
        </SimpleForm>
    </Edit>
);

const BandList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id"/>
            <TextField source="name"/>
        </Datagrid>
    </List>
);

const bands = [
    {
        id: "1",
        name: "Metallica"
    },
    {
        id: "2",
        name: "Apocalyptica"
    },
    {
        id: "3",
        name: "Seether"
    }
]

const venues = [
    {
        id: "1",
        name: "Alcatraz",
        location: "Milan"
    },
    {
        id: "2",
        name: "Razzmatazz",
        location: "Barcelona"
    },
    {
        id: "3",
        name: "Barba Negra",
        location: "Budapest"
    }
];
const performances = [
    {
        id: "1",
        band_id: "2",
        venue_id: "3",
        date: new Date(2024, 10, 25)
    }
]

const band_details = [
    {
        id: "1",
        band_id: "2",
        biography: "Lorem ipsum...",
        style: "Symphonic Heavy",
        status: "Active",
        formed_in: 1993,
        country: "Finland"
    },
    {
        id: "2",
        band_id: "3",
        biography: "Lorem ipsum...",
        style: "Grunge",
        status: "Active",
        formed_in: 2002,
        country: "South-Africa"
    }
]

const dataProvider = fakeDataProvider({bands, venues, performances, band_details});
const fakeCreate = dataProvider.create;
const fakeUpdate = dataProvider.update;
dataProvider.create = (resource: string, params: CreateParams) => {
    // fail saving performance for Apocalyptica in Alcatraz
    if (resource === "performances" && params.data.band_id === "2" && params.data.venue_id === "1") {
        return Promise.reject("Nope")
    } else {
        return fakeCreate(resource, params);
    }
}
dataProvider.update = (resource: string, params: UpdateParams) => {
    //fail saving band details for Seether
    if (resource === "band_details" && params.data.band_id === "3") {
        return Promise.reject("Nope")
    } else {
        return fakeUpdate(resource, params);
    }
}

function App() {
    return (
        <Admin dataProvider={dataProvider}>
            <Resource name="bands" list={BandList} edit={BandEdit}/>
        </Admin>
    );
}

export default App;